const { SongPlay, Song, Artist, Album, sequelize } = require("../models");
const { Op } = require("sequelize");


exports.topSongs = async (req, res) => {
  try {
    const topSongs = await SongPlay.findAll({
      attributes: [
        "songId",
        [sequelize.fn("COUNT", sequelize.col("songId")), "playCount"],
      ],
      include: [
        { model: Song, attributes: ["title", "audioUrl"] },
        { model: Artist, attributes: ["name"] },
        { model: Album, attributes: ["title", "coverUrl"] },
      ],
      group: ["SongPlay.songId", "Song.id", "Artist.id", "Album.id"],
      order: [[sequelize.fn("COUNT", sequelize.col("songId")), "DESC"]],
      limit: 10,
    });

    res.json(topSongs);
  } catch (error) {
    console.error("Error obteniendo top canciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.topArtists = async (req, res) => {
  try {
    const topArtists = await SongPlay.findAll({
      attributes: [
        "artistId",
        [sequelize.fn("COUNT", sequelize.col("artistId")), "playCount"],
      ],
      include: [{ model: Artist, attributes: ["name", "imageUrl"] }],
      group: ["SongPlay.artistId", "Artist.id"],
      order: [[sequelize.fn("COUNT", sequelize.col("artistId")), "DESC"]],
      limit: 10,
    });

    res.json(topArtists);
  } catch (error) {
    console.error("Error obteniendo top artistas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.topAlbums = async (req, res) => {
  try {
    const topAlbums = await SongPlay.findAll({
      attributes: [
        "albumId",
        [sequelize.fn("COUNT", sequelize.col("albumId")), "playCount"],
      ],
      include: [{ model: Album, attributes: ["title", "coverUrl"] }],
      group: ["SongPlay.albumId", "Album.id"],
      order: [[sequelize.fn("COUNT", sequelize.col("albumId")), "DESC"]],
      limit: 10,
    });

    res.json(topAlbums);
  } catch (error) {
    console.error("Error obteniendo top álbumes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.userStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await SongPlay.findAll({
      attributes: [
        "songId",
        [sequelize.fn("COUNT", sequelize.col("songId")), "playCount"],
      ],
      where: { userId },
      include: [
        { model: Song, attributes: ["title"] },
        { model: Artist, attributes: ["name"] },
      ],
      group: ["SongPlay.songId", "Song.id", "Artist.id"],
      order: [[sequelize.fn("COUNT", sequelize.col("songId")), "DESC"]],
      limit: 10,
    });

    res.json(stats);
  } catch (error) {
    console.error("Error en estadísticas de usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



// 📈 Plays agrupados por mes (últimos 12 meses)
exports.monthlyPlays = async (req, res) => {
  try {
    const now = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(now.getMonth() - 11);

    const stats = await SongPlay.findAll({
      attributes: [
        // Agrupar por año-mes → formato YYYY-MM
        [sequelize.fn("TO_CHAR", sequelize.col("playedAt"), "YYYY-MM"), "month"],
        [sequelize.fn("COUNT", sequelize.col("id")), "playCount"],
      ],
      where: {
        playedAt: {
          [Op.between]: [twelveMonthsAgo, now],
        },
      },
      group: [sequelize.fn("TO_CHAR", sequelize.col("playedAt"), "YYYY-MM")],
      order: [[sequelize.fn("TO_CHAR", sequelize.col("playedAt"), "YYYY-MM"), "ASC"]],
      raw: true,
    });

    res.json(stats);
  } catch (error) {
    console.error("Error en estadísticas mensuales:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.artistStats = async (req, res) => {
  try {
    const artistId = req.params.artistId;

    // 🟦 1. Obtener todas las canciones del artista
    const songs = await Song.findAll({
      where: { artistId },
      attributes: ["id", "title", "albumId"],
    });

    if (songs.length === 0) {
      return res.json({
        totalPlays: 0,
        topSong: null,
        topAlbum: null,
        songsStats: [],
        albumsStats: [],
      });
    }

    const songIds = songs.map((s) => s.id);

    // 🟦 2. Plays por canción
    const songsStats = await SongPlay.findAll({
      attributes: [
        "songId",
        [sequelize.fn("COUNT", sequelize.col("songId")), "playCount"],
      ],
      where: { songId: songIds },
      include: [
        { model: Song, attributes: ["title", "albumId"] },
        { model: Album, attributes: ["title", "coverUrl"] },
      ],
      group: ["SongPlay.songId", "Song.id", "Album.id"],
      order: [[sequelize.literal("playCount"), "DESC"]],
    });

    // 🟦 3. Total del artista
    const totalPlays = songsStats.reduce(
      (acc, item) => acc + Number(item.dataValues.playCount),
      0
    );

    // 🟦 4. Top canción
    const topSong = songsStats.length > 0 ? songsStats[0] : null;

    // 🟦 5. Agrupar por álbum
    const albumsMap = {};
    songsStats.forEach((item) => {
      const albumId = item.Song.albumId;
      const playCount = Number(item.dataValues.playCount);
      const albumTitle = item.Album?.title || "Sin álbum";

      if (!albumsMap[albumId]) {
        albumsMap[albumId] = {
          albumId,
          title: albumTitle,
          coverUrl: item.Album?.coverUrl || null,
          playCount: 0,
        };
      }

      albumsMap[albumId].playCount += playCount;
    });

    const albumsStats = Object.values(albumsMap).sort(
      (a, b) => b.playCount - a.playCount
    );

    // 🟦 6. Top álbum
    const topAlbum = albumsStats.length > 0 ? albumsStats[0] : null;

    // 🟦 7. Respuesta final
    res.json({
      totalPlays,
      topSong,
      topAlbum,
      songsStats,
      albumsStats,
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas del artista:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};







