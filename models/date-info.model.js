module.exports = (sequelize, Sequelize) => {
  const DateInfo = sequelize.define('date-info', {
    date: {
      type: Sequelize.DATEONLY,
      primaryKey: true,
      allowNull: false
    },
    isEntered: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    isAvailable: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  });

  return DateInfo;
};