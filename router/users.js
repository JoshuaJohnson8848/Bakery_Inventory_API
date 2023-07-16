const express = require('express');
const router = express.Router();
const userController = require('../controller/user');

router.get('', userController.getUsers);

router.get('/:id', userController.getUserById);

router.post('', userController.createUser);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUserById);

module.exports = router;
