const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const userRouter = require('./router/users');
const productRouter = require('./router/product');

app.use(express.json());

dotenv.config({ path: './config/.env' });

app.use('/users', userRouter);
app.use('/product', productRouter);

app.use((error, req, res, next) => {
  const data = error.data;
  const message = error.message;
  const status = error.status || 500;
  res.status(status).json({ message: message, data: data });
  next();
});

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
