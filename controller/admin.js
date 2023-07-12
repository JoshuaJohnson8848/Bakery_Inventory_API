const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const existingEmail = await Admin.findOne({ email: email });
    if (existingEmail) {
      const error = new Error('Email is Already Exist');
      error.status = 422;
      throw error;
    }
    const hashPass = await bcrypt.hash(password, 12);
    if (!hashPass) {
      const error = new Error('Password Hash failed, Something Went Wrong');
      error.status = 422;
      throw error;
    }
    const admin = await new Admin({
      name: name,
      email: email,
      password: hashPass,
    });
    const createdAdmin = await admin.save();
    res
      .status(200)
      .json({ message: 'Admin Created Succesfully', admin: createdAdmin });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    let loadedAdmin;

    const email = req.body.email;
    const password = req.body.password;

    const existingAdmin = await Admin.findOne({ email: email });
    if (!existingAdmin) {
      const error = new Error('Email not Found');
      error.status = 404;
      throw error;
    }
    loadedAdmin = existingAdmin;
    const hashedPass = await bcrypt.compare(password, loadedAdmin.password);
    if (!hashedPass) {
      const error = new Error('Incorrect Password');
      error.status = 422;
      throw error;
    }
    const token = await jwt.sign(
      {
        email: loadedAdmin.email,
        doctorId: loadedAdmin._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );
    res.status(200).json({
      message: 'Logged In Successfully',
      token: token,
      adminId: loadedAdmin._id,
    });
  } catch (err) {
    console.log(err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
