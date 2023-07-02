const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
