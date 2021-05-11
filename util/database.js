const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'airport-schedule',
  'root', '11111111', 
  {dialect: 'mysql'}
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.dateInfo = require("../models/date-info.model")(sequelize, Sequelize);
db.flightsSchedule = require("../models/flights-schedule.model")(sequelize, Sequelize);
db.tempSchedule = require("../models/temp-schedule.model")(sequelize, Sequelize);
db.voteOrder = require("../models/vote-order.model")(sequelize, Sequelize);
db.votedUser = require("../models/voted-user.model")(sequelize, Sequelize);


db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
db.dateInfo.hasMany(db.votedUser, {
  foreignKey: "date",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});
db.dateInfo.hasMany(db.tempSchedule, {
  foreignKey: "date",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.ROLES = ["user", "admin"];

db.initialize = function() {
  db.role.findOrCreate({
    where: {
      rolename: db.ROLES[0]
    }
  });
 
  db.role.findOrCreate({
    where: {
      rolename: db.ROLES[1]
    }
  });
}

module.exports = db;