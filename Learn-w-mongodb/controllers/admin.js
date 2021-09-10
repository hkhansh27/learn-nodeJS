const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(
      title,
      price,
      description,
      imageUrl,
      null,
      req.user._id
    );
    await product.save();
    return res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    const productId = req.params.productId;
    const products = await Product.findByPk(productId);
    if (!editMode) return res.redirect('/');
    if (!products) return;
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: products,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const { productId, title, price, imageUrl, description } = req.body;
    const product = new Product(title, price, description, imageUrl, productId);
    await product.save();
    return res.redirect('/admin/products');
  } catch (error) {
    console.log(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render('admin/products', {
      products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    await Product.deleteByID(productId);
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error);
  }
};
