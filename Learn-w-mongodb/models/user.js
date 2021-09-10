const mongo = require('mongodb');
const { getDb } = require('../util/database');

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; //{items: []}
    this._id = new mongo.ObjectId(id);
  }
  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .find({ _id: new mongo.ObjectId(userId) })
      .next()
      .then(user => {
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .then(user => {
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }

  addToCart(product) {
    console.log('Cart from addToCart function before add');
    console.log(this.cart);
    let updatedCartItems = [];
    let newQuantity = 1;
    //check if cart is empty
    if (!this.cart) {
      updatedCartItems.push({
        productId: new mongo.ObjectId(product._id),
        quantity: newQuantity,
      });
    } else {
      //check if an added product exist
      const cartProductIndex = this.cart.items.findIndex(
        cartProduct =>
          cartProduct.productId.toString() === product._id.toString() //TODO: data is taken from db, so 2 'id' are not string type in JS.
      );
      //spread old data
      updatedCartItems = [...this.cart.items];

      if (cartProductIndex >= 0) {
        //increase quantity
        newQuantity = ++this.cart.items[cartProductIndex].quantity;
        //update quantity for an existing product
        updatedCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({
          productId: new mongo.ObjectId(product._id),
          quantity: newQuantity,
        });
      }
    }
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      )
      .then(cart => {
        return cart;
      })
      .catch(err => {
        console.log(err);
      });
  }

  deleteProductsFromCart(productId) {
    const updatedCartItem = this.cart.items.filter(
      item => item.productId.toString() !== productId.toString()
    );
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItem } } }
      )
      .then(cart => {
        return cart;
      })
      .catch(err => {
        console.log(err);
      });
  }

  getCart() {
    const db = getDb();
    if (!this.cart) this.cart = { items: [] };
    const productIds = this.cart.items.map(prod => prod.productId);
    return (
      //TODO: Understand
      db
        .collection('products')
        .find({ _id: { $in: productIds } })
        .toArray()
        .then(products => {
          return products.map(p => {
            return {
              ...p,
              quantity: this.cart.items.find(
                i => i.productId.toString() === p._id.toString()
              ).quantity,
            };
          });
        })
        .catch(err => console.log(err))
    );
  }
}

module.exports = User;
