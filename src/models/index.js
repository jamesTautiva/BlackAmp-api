const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User')(sequelize, DataTypes);
const Artist = require('./Artist')(sequelize, DataTypes);
const Album = require('./Album')(sequelize, DataTypes);
const Song = require('./Song')(sequelize, DataTypes);
const Playlist = require('./Playlist')(sequelize, DataTypes);

Artist.hasMany(Album);
Album.belongsTo(Artist);

Artist.hasMany(Song);
Song.belongsTo(Artist);

Album.hasMany(Song);
Song.belongsTo(Album);

User.hasMany(Playlist);
Playlist.belongsTo(User);

const PlaylistSongs = sequelize.define('PlaylistSongs', {}, { timestamps: false });
Playlist.belongsToMany(Song, { through: PlaylistSongs });
Song.belongsToMany(Playlist, { through: PlaylistSongs });

module.exports = { sequelize, User, Artist, Album, Song, Playlist, PlaylistSongs };