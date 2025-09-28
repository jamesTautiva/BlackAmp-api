// src/routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

// Rutas protegidas
router.post("/", commentController.addComment);
router.get("/:songId", commentController.getCommentsBySong);
router.delete("/:commentId", commentController.deleteComment);

module.exports = router;
