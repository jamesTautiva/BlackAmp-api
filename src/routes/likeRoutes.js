// src/routes/likeRoutes.js
const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");

// Rutas protegidas
router.post("/", likeController.addLike);
router.delete("/:songId", likeController.removeLike);
router.get("/:songId", likeController.getSongLikes);

module.exports = router;
