// models/Playlist.js
module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define("Playlist", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    coverUrl: {
      type: DataTypes.STRING, // portada opcional de la playlist
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // pública o privada
    },
  });


  return Playlist;
};
