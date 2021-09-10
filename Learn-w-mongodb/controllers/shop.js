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
    const orders = await req.user.getOrders({ include: ['products'] }); //Eager loading
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user.createOrder().then(order => {
        //TODO: Understand this?
        return order.addProducts(
          products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          })
        );
      });
    })
    .then(result => fetchedCart.setProducts(null))
    .then(result => res.redirect('/orders'))
    .catch(err => console.log(err));
};

exports.postDeleteAllOrder = async (req, res, next) => {
  try {
    await Order.destroy({ where: { userId: req.user.id } });
    return res.redirect('/orders');
  } catch (error) {
    console.log(error);
  }
};
