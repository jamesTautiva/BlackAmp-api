module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('Album', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    producer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'aproved', 'rejected'),
      defaultValue: 'pending',
    },
    coverUrl: {
      type: DataTypes.STRING,
    },
  });

  return Album;
};
