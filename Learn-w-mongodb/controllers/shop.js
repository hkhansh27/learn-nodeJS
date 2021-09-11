// const Order = require('../models/order');
const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const products = await req.user.getCart();
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findByPk(productId);
    await req.user.addToCart(product);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  //FIXME: deleted a product which was part of the carts of different users
  //but app works correctly
  //TODO: implement "worker process" or an alternative is when fetching the cart, the mismatch in the fetched cart and cart in db. But now i have to work on my project :v hihi
  try {
    const { productId } = req.body;
    await req.user.deleteProductsFromCart(productId);
    res.redirect('/cart');
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders();
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    await req.user.addOrder();
    res.redirect('/orders');
  } catch (error) {
    console.log(error);
  }
};
