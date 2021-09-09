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
    await req.user.createProduct({ title, price, imageUrl, description });
    return res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};

// exports.getEditProduct = async (req, res, next) => {
//   try {
//     const editMode = req.query.edit;
//     const productId = req.params.productId;
//     const products = await req.user.getProducts({ where: { id: productId } }); //return an array
//     // const product = await Product.findByPk(productId); //return 1 product
//     if (!editMode) return res.redirect('/');
//     if (!products) return;
//     res.render('admin/edit-product', {
//       pageTitle: 'Edit Product',
//       path: '/admin/edit-product',
//       editing: editMode,
//       product: products[0],
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.postEditProduct = async (req, res, next) => {
//   try {
//     const { productId, title, price, imageUrl, description } = req.body;
//     const product = await Product.findByPk(productId);
//     product.title = title;
//     product.price = price;
//     product.description = description;
//     product.imageUrl = imageUrl;
//     await product.save();
//     return res.redirect('/admin/products');
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.getProducts = async (req, res, next) => {
//   try {
//     // const products = await Product.findAll();
//     const products = await req.user.getProducts();
//     res.render('admin/products', {
//       products,
//       pageTitle: 'Admin Products',
//       path: '/admin/products',
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.postDeleteProduct = async (req, res, next) => {
//   try {
//     const productId = req.body.productId;
//     const product = await Product.findByPk(productId);
//     await product.destroy();
//     res.redirect('/admin/products');
//   } catch (error) {
//     console.log(error);
//   }
// };
