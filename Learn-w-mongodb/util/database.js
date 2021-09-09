const { MongoClient } = require('mongodb');

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://hkhansh27:wlQY5chQIfM5DvPA@learn-node-cluster.q9w9t.mongodb.net/shop?retryWrites=true&w=majority'
  )
    .then(client => {
      console.log('Connected');
      _db = client.db(); //by default it will connect to "shop" because that is in connection string
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) return _db;
  throw 'No database';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
