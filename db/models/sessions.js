export default (sequelize, DataTypes) =>
  sequelize.define('session', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    sess: {
      type: DataTypes.JSON
    },
    expire: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: true,
    freezeTableName: true
  });
