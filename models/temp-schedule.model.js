module.exports = (sequelize, Sequelize) => {
  const TempSchedule = sequelize.define('temp-schedule', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    from: {
      type: Sequelize.STRING,
      allowNull: false
    },
    to: {
      type: Sequelize.STRING,
      allowNull: false
    },
    airlineId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    flightNumber: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  return TempSchedule;
};