module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rolename: {
      type: Sequelize.STRING,
      unique: true
    }
  });

  return Role;
};