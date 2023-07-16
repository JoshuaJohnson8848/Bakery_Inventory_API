const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');

router.get('', adminController.getAllAdmins);

router.post('/signup', adminController.signup);

router.post('/login', adminController.login);

module.exports = router;
