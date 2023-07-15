const express = require('express');
const router = express.Router();
const historyController = require('../controller/history');

router.get('/:id', historyController.getHistoryById);

router.get('/total/:id', historyController.totalAmountByUser);

// router.get('', historyController.totalAmountForAllUser);

router.post('', historyController.createHistory);

module.exports = router;
