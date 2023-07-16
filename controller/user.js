'use strict';

const User = require('../models/users');

exports.createUser = async (req, res, next) => {
  try {
    const name = req.body.name;

    const user = new User({
      name: name,
    });

    const createdUser = await user.save();

    return res.status(200).json({ message: 'New User Created', user });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User Not Found');
      error.status = 404;
      throw error;
    }
    return res.status(200).json({ message: 'User Fetched Successfully', user });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      const error = new Error('Users Not Found');
      error.status = 404;
      throw error;
    }
    return res.status(200).json({ message: 'Users Found Successfully', users });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const name = req.body.name;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User Not Found');
      error.status = 404;
      throw error;
    }

    await (user.name = name);
    await user.save();

    return res.status(200).json({ message: 'User Updated Successfully', user });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.deleteUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const deleteUser = await User.findByIdAndRemove(userId);
    if (!deleteUser) {
      const error = new Error('User Not Deleted');
      error.status = 404;
      throw error;
    }

    // const history = await History.find({ userId: userId });

    // console.log(history);

    // if (history) {
    //   const deleteUserHistory = await History.findByIdAndRemove({
    //     userId: userId,
    //   });
    // }

    return res.status(200).json({ message: 'User Deleted Successfully' });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
