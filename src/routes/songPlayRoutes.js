const express = require("express");
const router = express.Router();
const songPlayController = require("../controllers/songPlayController");

// Registrar reproducción
const { requireAuth } = require("../middleware/auth");

// Registrar reproducción
router.post("/register", songPlayController.registerPlay);

// Historial de usuario
router.get("/history/:userId", requireAuth, songPlayController.getUserHistory);

module.exports = router;
