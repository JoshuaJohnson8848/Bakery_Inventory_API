const { Types, default: mongoose } = require('mongoose');
const History = require('../models/history');
const User = require('../models/users');

exports.createHistory = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const items = req.body.items;

    const createHistory = await new History({
      userId: req.body.userId,
      date: req.body.date,
      items: items,
    });

    const createdHistory = await createHistory.save();

    return res
      .status(200)
      .json({ messsage: 'History Created Successfully', createdHistory });
  } catch (err) {
    console.log(err);
  }
};

exports.getHistoryById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const history = await History.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'products',
          localField: 'items.item',
          foreignField: '_id',
          as: 'product_details',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          userId: '$userId',
          userName: '$user.name',
          date: '$date',
          name: '$product_details.name',
          price: '$product_details.price',
          qty: '$items.qty',
        },
      },
      { $sort: { date: -1 } },
    ]);

    if (!history) {
      const error = new Error('History Not Found');
      error.status = 404;
      throw error;
    }

    return res
      .status(200)
      .json({ message: 'History Found Successfully', history: history });
  } catch (err) {
    console.log(err);
  }
};

exports.totalAmountByUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const TotalAmount = await History.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'products',
          localField: 'items.item',
          foreignField: '_id',
          as: 'product_details',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          userId: '$userId',
          userName: '$user.name',
          date: '$date',
          name: '$product_details.name',
          price: '$product_details.price',
          qty: '$items.qty',
        },
      },
      { $sort: { date: -1 } },
    ]);

    const totalAmount = await TotalAmount.map((item) => {
      const totalPrice = item.price.map(
        (price, index) => price * item.qty[index]
      );
      return totalPrice;
    });

    const sum = totalAmount.reduce((accumulator, innerArray) => {
      const innerSum = innerArray.reduce(
        (innerAccumulator, currentValue) => innerAccumulator + currentValue,
        0
      );
      return accumulator + innerSum;
    }, 0);

    return res.status(200).json({
      message: 'Total Amount Fetched Successfully',
      totalAmount: sum,
      userName: TotalAmount[0].userName,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.totalAmountForAllUser = async (req, res, next) => {
  try {
    let userIds = [];
    const users = await User.find();

    users.forEach((obj) => {
      userIds.push(obj._id);
    });

    const TotalAmount = await History.aggregate([
      {
        $match: {
          userId: {
            $in: userIds.map((id) => new Types.ObjectId(id)),
          },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.item',
          foreignField: '_id',
          as: 'product_details',
        },
      },
      {
        $project: {
          userId: '$userId',
          date: '$date',
          name: '$product_details.name',
          price: '$product_details.price',
          qty: '$items.qty',
        },
      },
      {
        $addFields: {
          multipliedPrice: {
            $map: {
              input: '$price',
              as: 'singlePrice',
              in: {
                $multiply: [
                  '$$singlePrice',
                  {
                    $arrayElemAt: [
                      '$qty',
                      { $indexOfArray: ['$price', '$$singlePrice'] },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalMultipliedPrice: {
            $reduce: {
              input: '$multipliedPrice',
              initialValue: 0,
              in: { $add: ['$$value', '$$this'] },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'User_Name',
        },
      },
      {
        $project: {
          userName: '$User_Name.name',
          userId: '$userId',
          date: '$date',
          name: '$product_details.name',
          price: '$product_details.price',
          qty: '$items.qty',
          amount: '$totalMultipliedPrice',
        },
      },
      {
        $unwind: '$userName',
      },
      {
        $group: {
          _id: '$userId',
          data: {
            $push: '$$ROOT',
          },
          sum: { $sum: '$amount' },
        },
      },
      {
        $project: {
          userName: { $arrayElemAt: ['$data', 0] },
          sum: 1,
        },
      },
      {
        $project: {
          userId: '$userName.userId',
          name: '$userName.userName',
          sum: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: 'Total Amount Fetched Successfully',
      amountByUser: TotalAmount,
    });
  } catch (err) {
    console.log(err);
  }
};
