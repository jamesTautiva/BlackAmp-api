// src/controllers/commentController.js
const { Comment, Song, User } = require("../models");

exports.addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId, content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "El comentario no puede estar vacío" });
    }

    const song = await Song.findByPk(songId);
    if (!song) {
      return res.status(404).json({ error: "Canción no encontrada" });
    }

    const comment = await Comment.create({ userId, songId, content });
    res.status(201).json({ message: "Comentario agregado", comment });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar comentario", details: error.message });
  }
};

exports.getCommentsBySong = async (req, res) => {
  try {
    const { songId } = req.params;

    const comments = await Comment.findAll({
      where: { songId },
      include: [{ model: User, attributes: ["id", "username"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener comentarios", details: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: "No puedes eliminar este comentario" });
    }

    await comment.destroy();
    res.json({ message: "Comentario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar comentario", details: error.message });
  }
};
