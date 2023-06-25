const Product = require('../models/products');

exports.createProduct = async (req, res, next) => {
  try {
    const name = req.body.name;
    const price = req.body.price;

    const product = new Product({
      name: name,
      price: price,
    });

    const createdProduct = await product.save();

    return res.status(200).json({ message: 'New Product Created', product });
  } catch (err) {
    return new Error('Internal Server Error');
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    return res
      .status(200)
      .json({ message: 'Product Fetched Successfully', product });
  } catch (err) {
    return new Error('Internal Server Error');
  }
};

exports.deleteProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndRemove(productId);
    return res.status(200).json({ message: 'product Deleted Succesfully' });
  } catch (err) {
    return new Error('Internal Server Error');
  }
};
