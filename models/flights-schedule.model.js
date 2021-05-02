module.exports = (sequelize, Sequelize) => {
  const FlightsSchedule = sequelize.define('flights-schedule', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false
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
    },
    departureTime: {
      type: Sequelize.DATE,
      allowNull: true
    },
    arrivalTime: {
      type: Sequelize.DATE,
      allowNull: true
    }
  });

  return FlightsSchedule;
};