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
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, description, price);
    await product.save();
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect('/');

  const productId = req.params.productId;
  Product.findById(productId, products => {
    if (!products) return;
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      products,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;
  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  );
  updatedProduct.save();
  return res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  const productId = req.body.productId;
  await Product.deleteById(productId);
  res.redirect('/admin/products');
};