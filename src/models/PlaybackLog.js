module.exports = (sequelize, DataTypes) => {
  const PlaybackLog = sequelize.define('PlaybackLog', {
    songId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Songs',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deviceInfo: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    }
  });


  return PlaybackLog;
};
