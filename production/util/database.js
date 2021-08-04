const Sequelize = require('sequelize');

const sequelize = new Sequelize('learn-node', 'root', 'Khanh#123', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
