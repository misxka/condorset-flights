module.exports = (sequelize, Sequelize) => {
  const VotedUser = sequelize.define('voted-user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['date', 'userId']
      }
    ]
  });

  return VotedUser;
};