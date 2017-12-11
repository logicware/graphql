export default (sequelize, DataTypes) => {
  const Topic = sequelize.define('Topic', {
    text: DataTypes.STRING,
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
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
  }, {
    timestamps: false
  });

  Topic.associate = function (models) {
    Topic.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };

  return Topic;
}