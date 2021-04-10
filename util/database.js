const Sequelize = require('sequelize');

const sequelize = new Sequelize('airport-schedule', 'root', '11111111', {dialect: 'mysql'});

module.exports = sequelize;