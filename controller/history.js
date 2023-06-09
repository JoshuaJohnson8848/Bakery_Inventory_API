const { Types } = require('mongoose');
const History = require('../models/history');

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
    userId = req.body.userId;

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
        $project: {
          userId: '$userId',
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

    console.log(JSON.stringify(history, 0, 2));

    return res
      .status(200)
      .json({ message: 'History Found Successfully', history: history });
  } catch (err) {
    console.log(err);
  }
};

exports.totalAmountByUser = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    const TotalAmount = await History.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      // {
      //   $group: {
      //     _id: '$createdAt',
      //     data: { $push: '$$ROOT' },
      //   },
      // },
      // { $unwind: '$data' },
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
      { $sort: { date: -1 } },
      // { $unwind: '$price' },
      // { $unwind: '$name' },
      // { $unwind: '$qty' },
      // {
      //   $project: {
      //     userId: 1,
      //     createdAt: 1,
      //     name: '$name',
      //     price: '$price',
      //     qty: '$qty',
      //     subTotal: { $multiply: ['$price', '$qty'] },
      //   },
      // },
      // {
      //   $group: {
      //     _id: '$createdAt',
      //     items: { $push: '$$ROOT' },
      //     TotalAmount: { $sum: '$subTotal' },
      //   },
      // },
      // {
      //   $project: {
      //     userId: 1,
      //     items: '$items',
      //     Total: '$TotalAmount',
      //   },
      // },
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

    return res
      .status(200)
      .json({ message: 'Total Amount Fetched Successfully', totalAmount: sum });
  } catch (err) {
    console.log(err);
  }
};
