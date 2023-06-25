const History = require('../models/history');

exports.createHistory = async (req, res, next) => {
  try {
    const history = new History({
      userId: req.userId,
    });
  } catch (err) {}
};
