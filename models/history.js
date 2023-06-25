const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const historySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    date: {
      type: Date,
      required: true,
    },
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        qty: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('History', historySchema);
