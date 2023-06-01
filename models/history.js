const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const historySchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    item: [{}],
    amount: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('History', historySchema);
