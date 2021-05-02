module.exports = (sequelize, Sequelize) => {
  const VoteOrder = sequelize.define('vote-order', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    order: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['date', 'order']
      }
    ]
  });

  return VoteOrder;
};