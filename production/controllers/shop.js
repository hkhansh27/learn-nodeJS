const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
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
    const products = await Product.findAll();
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
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  let product, fetchCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchCart = cart;
      return cart.getProducts({ where: { id: productId } }); //products table
    })
    .then(products => {
      if (products.length > 0) product = products[0];
      if (product) {
        oldQuantity = product.cartItem.quantity;
        newQuantity += oldQuantity;
      }
      return Product.findByPk(productId);
    })
    .then(product => {
      fetchCart.addProduct(product, { through: { quantity: newQuantity } });
      res.redirect('/cart');
    })
    .catch(error => console.log(error));
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const cart = await req.user.getCart();
    const [product] = await cart.getProducts({ where: { id: productId } });
    await product.cartItem.destroy(); //do not destroy product in products table but in-between table aka. caritems table
    res.redirect('/cart');
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
