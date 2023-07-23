const Product = require('../models/products');
const History = require('../models/history');

exports.createProduct = async (req, res, next) => {
  try {
    const name = req.body.name;
    const price = req.body.price;
    const qty = req.body.qty;

    const product = new Product({
      name: name,
      price: price,
      qty: qty,
    });

    const createdProduct = await product.save();

    if (!createdProduct) {
      const error = new Error('Product Not Created');
      error.status = 404;
      throw error;
    }
    return res
      .status(200)
      .json({ message: 'New Product Created', product: createdProduct });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product Not Found');
      error.status = 404;
      throw error;
    }
    return res
      .status(200)
      .json({ message: 'Product Fetched Successfully', product });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.deleteProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const isProductInHistory = await History.exists({
      'items.item': productId,
    });
    if (isProductInHistory) {
      return res.status(200).json({
        message: 'Product is included in history and cannot be deleted',
      });
    }

    const deletedProduct = await Product.findByIdAndRemove(productId);
    if (!deletedProduct) {
      const error = new Error('Product Not Deleted');
      error.status = 404;
      throw error;
    }
    return res.status(200).json({ message: 'Product Deleted Succesfully' });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    if (!products) {
      const error = new Error('Products Not Found');
      error.status = 404;
      throw error;
    }
    return res
      .status(200)
      .json({ message: 'Products Fetched Successfully', products });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.updateProuct = async (req, res, next) => {
  try {
    const name = req.body.name;
    const qty = req.body.qty;
    const price = req.body.price;
    const productId = req.params.id;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      const error = new Error('Product Not Found');
      error.status = 404;
      throw error;
    }

    await (existingProduct.name = name);
    await (existingProduct.qty = qty);
    await (existingProduct.price = price);

    await existingProduct.save();

    return res.status(200).json({
      message: 'Product Updated Successfully',
      product: existingProduct,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
