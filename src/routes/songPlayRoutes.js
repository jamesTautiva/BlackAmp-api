const express = require("express");
const router = express.Router();
const songPlayController = require("../controllers/songPlayController");
const authMiddleware = require("../middlewares/authMiddleware");

// Registrar reproducción
router.post("/register", authMiddleware, songPlayController.registerPlay);

// Historial de usuario
router.get("/history", authMiddleware, songPlayController.getUserHistory);

module.exports = router;
