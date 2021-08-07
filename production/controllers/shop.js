const Order = require('../models/order');
const Product = require('../models/product');

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
  let product, fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } }); //cartItem table
    })
    .then(products => {
      //check if product is available in cartItem table
      // first time postCart products, product variables will empty mean [] and undefined
      // second time postCart it will be product itself
      if (products.length > 0) product = products[0];
      if (product) {
        oldQuantity = product.cartItem.quantity;
        newQuantity += oldQuantity;
      }
      return Product.findByPk(productId);
    })
    .then(product =>
      fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    )
    .then(result => res.redirect('/cart'))
    .catch(error => console.log(error));
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const cart = await req.user.getCart();
    const [product] = await cart.getProducts({ where: { id: productId } });
    await product.cartItem.destroy(); //do not destroy product in products table but in-between table aka. carItem table
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
  await Order.destroy({ where: { id: req.user.id } });
  return res.redirect('/orders');
};
