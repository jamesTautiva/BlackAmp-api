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
    linkFacebook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkInstagram: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkYoutube: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Nombre de la tabla
        key: 'id'
      },
    }
  });

  return Artist;
};