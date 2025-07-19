module.exports = (sequelize, DataTypes) => {
  const Artist = sequelize.define('Artist', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    genere: {
      type: DataTypes.STRING,
      allowNull: true,
    },
        userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return Artist;
};
