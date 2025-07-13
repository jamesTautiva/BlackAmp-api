module.exports = (sequelize, DataTypes) => {
  const Composer = sequelize.define('Composer', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Composer;
};