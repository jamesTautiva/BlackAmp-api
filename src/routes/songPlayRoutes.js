const express = require("express");
const router = express.Router();
const songPlayController = require("../controllers/songPlayController");

// Registrar reproducción
router.post("/register",  songPlayController.registerPlay);

// Historial de usuario
router.get("/history",  songPlayController.getUserHistory);

module.exports = router;
