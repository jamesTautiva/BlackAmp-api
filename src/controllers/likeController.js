// src/controllers/likeController.js
const { Like, Song, User } = require("../models");

exports.addLike = async (req, res) => {
  try {
    const userId = req.user.id; // viene del token
    const { songId } = req.body;

    const song = await Song.findByPk(songId);
    if (!song) {
      return res.status(404).json({ error: "Canción no encontrada" });
    }

    // Verificar si ya existe un like de este usuario
    const existing = await Like.findOne({ where: { userId, songId } });
    if (existing) {
      return res.status(400).json({ error: "Ya diste like a esta canción" });
    }

    const like = await Like.create({ userId, songId });
    res.status(201).json({ message: "Like agregado", like });
  } catch (error) {
    res.status(500).json({ error: "Error al dar like", details: error.message });
  }
};

exports.removeLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.params;

    const like = await Like.findOne({ where: { userId, songId } });
    if (!like) {
      return res.status(404).json({ error: "Like no encontrado" });
    }

    await like.destroy();
    res.json({ message: "Like eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar like", details: error.message });
  }
};

exports.getSongLikes = async (req, res) => {
  try {
    const { songId } = req.params;
    const count = await Like.count({ where: { songId } });
    res.json({ songId, likes: count });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener likes", details: error.message });
  }
};
