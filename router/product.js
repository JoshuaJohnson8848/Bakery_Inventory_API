const express = require('express');
const router = express.Router();
const productController = require('../controller/product');

router.get('', productController.getAllProducts);

router.get('/:id', productController.getProductById);

router.post('', productController.createProduct);

router.put('/:id', productController.updateProuct);

router.delete('/:id', productController.deleteProductById);

module.exports = router;
