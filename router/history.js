const express = require('express');
const router = express.Router();
const historyController = require('../controller/history');

router.get('', historyController.getHistoryById);

router.post('', historyController.createHistory);

router.get('/total', historyController.totalAmountByUser);

module.exports = router;
