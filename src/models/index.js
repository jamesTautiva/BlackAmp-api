const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Model imports
const User = require('./User')(sequelize, DataTypes);
const Artist = require('./Artist')(sequelize, DataTypes);
const Album = require('./Album')(sequelize, DataTypes);
const Song = require('./Song')(sequelize, DataTypes);
const Playlist = require('./Playlist')(sequelize, DataTypes);
const Composer = require('./Composer')(sequelize, DataTypes);
const PlaybackLog = require('./PlaybackLog')(sequelize, DataTypes);
const PlaylistSongs = require('./PlaylistSong')(sequelize, DataTypes);
const SongPlay = require('./SongPlay')(sequelize, DataTypes);


// Associations

// User - Artist
User.hasOne(Artist, { foreignKey: 'userId', as: 'artist' });
Artist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Artist - Album
Artist.hasMany(Album, { foreignKey: 'artistId', as: 'albums' });
Album.belongsTo(Artist, { foreignKey: 'artistId', as: 'artist' });

// Artist - Song
Artist.hasMany(Song, { foreignKey: 'artistId', as: 'songs' });
Song.belongsTo(Artist, { foreignKey: 'artistId', as: 'artist' });

// Album - Song
Album.hasMany(Song, { foreignKey: 'albumId', as: 'songs' });
Song.belongsTo(Album, { foreignKey: 'albumId', as: 'album' });

// User - Playlist
User.hasMany(Playlist, { foreignKey: 'userId', as: 'playlists' });
Playlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Song - Composer (many to many)
Song.belongsToMany(Composer, {
  through: 'SongComposers',
  foreignKey: 'songId',
  otherKey: 'composerId',
  as: 'composers'
});
Composer.belongsToMany(Song, {
  through: 'SongComposers',
  foreignKey: 'composerId',
  otherKey: 'songId',
  as: 'songs'
});

// Playlist - Song (many to many)

Playlist.belongsToMany(Song, {
  through: PlaylistSongs,
  foreignKey: 'playlistId',
  otherKey: 'songId',
  as: 'songs'
});
Song.belongsToMany(Playlist, {
  through: PlaylistSongs,
  foreignKey: 'songId',
  otherKey: 'playlistId',
  as: 'playlists'
});

// PlaybackLog
PlaybackLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
PlaybackLog.belongsTo(Song, { foreignKey: 'songId', as: 'song' });


// Una playlist pertenece a un usuario (el que la crea)

 // Relación muchos a muchos con canciones
    Playlist.belongsToMany(models.Song, {
      through: "PlaylistSongs",
      foreignKey: "playlistId",
      otherKey: "songId",
      as: "songs",
    });
// Relación N:M Playlist ↔ Song
Playlist.belongsToMany(Song, {
  through: 'PlaylistSong',
  foreignKey: 'playlistId',
  otherKey: 'songId',
});
Song.belongsToMany(Playlist, {
  through: 'PlaylistSong',
  foreignKey: 'songId',
  otherKey: 'playlistId',
});

SongPlay.belongsTo(models.User, { foreignKey: "userId" });
SongPlay.belongsTo(models.Song, { foreignKey: "songId" });
SongPlay.belongsTo(models.Artist, { foreignKey: "artistId" });
SongPlay.belongsTo(models.Album, { foreignKey: "albumId" });
// Export models and sequelize
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
