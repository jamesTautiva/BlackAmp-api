const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User')(sequelize, DataTypes);
const Artist = require('./Artist')(sequelize, DataTypes);
const Album = require('./Album')(sequelize, DataTypes);
const Song = require('./Song')(sequelize, DataTypes);
const Playlist = require('./Playlist')(sequelize, DataTypes);
const Composer = require('./Composer')(sequelize, DataTypes);
const PlaybackLog = require('./PlaybackLog')(sequelize, DataTypes);

User.hasOne(Artist, { foreignKey: 'userId' });
Artist.belongsTo(User, { foreignKey: 'userId' });

Artist.hasMany(Album);
Album.belongsTo(Artist);

Artist.hasMany(Song);
Song.belongsTo(Artist);

Album.hasMany(Song);
Song.belongsTo(Album);

User.hasMany(Playlist);
Playlist.belongsTo(User);

Song.belongsToMany(Composer, { through: 'SongComposers' });
Composer.belongsToMany(Song, { through: 'SongComposers' });

const PlaylistSongs = sequelize.define('PlaylistSongs', {}, { timestamps: false });
Playlist.belongsToMany(Song, { through: PlaylistSongs });
Song.belongsToMany(Playlist, { through: PlaylistSongs });

PlaybackLog.belongsTo(User, { foreignKey: 'userId' });
PlaybackLog.belongsTo(Song, { foreignKey: 'songId' });

module.exports = {
  sequelize,
  User,
  Artist,
  Album,
  Song,
  Playlist,
  PlaylistSongs,
  Composer,
  PlaybackLog
};