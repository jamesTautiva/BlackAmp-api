const { Playlist, Song, PlaylistSong, User } = require("../models");

// Crear una nueva playlist
exports.createPlaylist = async (req, res) => {
  try {
    const userId = req.user.id; // usuario autenticado
    const { title, description, coverUrl, isPublic } = req.body;

    if (!title) {
      return res.status(400).json({ error: "El título es obligatorio" });
    }

    const playlist = await Playlist.create({
      title,
      description,
      coverUrl,
      isPublic,
      userId,
    });

    res.status(201).json(playlist);
  } catch (error) {
    console.error("Error creando playlist:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todas las playlists
exports.getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.findAll({
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "username", "email"],
        },
        {
          model: Song,
          as: "songs",
          through: { attributes: [] }, // evita mostrar PlaylistSongs
        },
      ],
    });

    res.json(playlists);
  } catch (error) {
    console.error("Error obteniendo playlists:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener una playlist por ID con sus canciones
exports.getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findByPk(id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "username", "email"],
        },
        {
          model: Song,
          as: "songs",
          through: { attributes: [] },
        },
      ],
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist no encontrada" });
    }

    res.json(playlist);
  } catch (error) {
    console.error("Error obteniendo playlist:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Agregar canción a la playlist
exports.addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findByPk(playlistId);
    const song = await Song.findByPk(songId);

    if (!playlist || !song) {
      return res.status(404).json({ error: "Playlist o canción no encontrada" });
    }

    await PlaylistSong.create({ playlistId, songId });

    res.json({ message: "Canción agregada a la playlist correctamente" });
  } catch (error) {
    console.error("Error agregando canción:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar canción de la playlist
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const deleted = await PlaylistSong.destroy({
      where: { playlistId, songId },
    });

    if (!deleted) {
      return res.status(404).json({ error: "La canción no estaba en la playlist" });
    }

    res.json({ message: "Canción eliminada de la playlist" });
  } catch (error) {
    console.error("Error eliminando canción:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar playlist
exports.deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Playlist.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: "Playlist no encontrada" });
    }

    res.json({ message: "Playlist eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando playlist:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
