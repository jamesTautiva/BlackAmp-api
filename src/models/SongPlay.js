
// models/SongPlay.js
module.exports = (sequelize, DataTypes) => {
  const SongPlay = sequelize.define("SongPlay", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    playedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

 
  return SongPlay;
};
