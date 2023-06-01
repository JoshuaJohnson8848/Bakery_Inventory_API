const express = require('express');
const app = express();
const dotenv = require('dotenv');
const userRouter = require('./router/users');
const mongoose = require('mongoose');

dotenv.config({ path: './config/.env' });

app.use('/users', userRouter);

mongoose
  .connect(process.env.MONGOURI)
  .then((result) => {
    console.log(`MongoDB Connected 🚀🚀`);
  })
  .then((finalResult) => {
    app.listen(process.env.PORT, (req, res, next) => {
      console.log(`Server is Running at PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    return new Error('Server Error');
  });
