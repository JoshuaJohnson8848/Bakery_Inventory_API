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
      error.status(404);
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
