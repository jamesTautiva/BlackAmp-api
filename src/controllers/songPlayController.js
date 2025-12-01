const { SongPlay, Song, Album, Artist } = require("../models");

exports.registerPlay = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; // opcional si el usuario no está logueado
    const { songId } = req.body;

    if (!songId) {
      return res.status(400).json({ error: "songId es obligatorio" });
    }

    // Traer info de la canción
    const song = await Song.findByPk(songId, {
      include: [
        { model: Album, as: "album" },
        { model: Artist, as: "artist" },
      ],
    });

    if (!song) {
      return res.status(404).json({ error: "Canción no encontrada" });
    }

    const play = await SongPlay.create({
      userId,
      songId,
      albumId: song.albumId,
      artistId: song.artistId,
    });

    res.status(201).json({
      message: "Reproducción registrada",
      play,
    });
  } catch (error) {
    console.error("Error registrando reproducción:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener historial de reproducciones de un usuario
exports.getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await SongPlay.findAll({
      where: { userId },
      include: [
        { model: Song, attributes: ["id", "title", "audioUrl"] },
        { model: Album, attributes: ["id", "title", "coverUrl"] },
        { model: Artist, attributes: ["id", "name"] },
      ],
      order: [["playedAt", "DESC"]],
    });

    res.json(history);
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
