const express = require('express');
const router = express.Router();
const prodcutController = require('../controller/product');

router.post('', prodcutController.createProduct);

router.get('/:id', prodcutController.getProductById);

router.delete('/:id', prodcutController.deleteProductById);

module.exports = router;
