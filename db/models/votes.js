export default (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
      date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('NOW')
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      topicId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Topics',
          key: 'id'
        }
      },
    },
    {
      timestamps: false,
      indexes: [
        {fields: ['userId', 'topicId']},
        {fields: ['topicId']}
      ]
    });

  Vote.associate = function (models) {
    Vote.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Vote.belongsTo(models.Topic, {
      foreignKey: 'topicId'
    });
  };

  return Vote;
}