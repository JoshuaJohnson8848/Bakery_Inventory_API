const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    history: {
      type: Schema.Types.ObjectId,
      ref: 'History',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
