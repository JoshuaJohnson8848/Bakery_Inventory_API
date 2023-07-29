const express = require('express');
const router = express.Router();
const historyController = require('../controller/history');

router.get('/total/:id', historyController.totalAmountByUser);

router.get('/totalAmounts', historyController.totalAmountForAllUser);

router.get('/:id', historyController.getHistoryById);

router.post('', historyController.createHistory);

module.exports = router;
