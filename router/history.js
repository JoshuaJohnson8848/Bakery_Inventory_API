const express = require('express');
const router = express.Router();
const historyController = require('../controller/history');

router.post('', historyController.createHistory);

module.exports = router;
