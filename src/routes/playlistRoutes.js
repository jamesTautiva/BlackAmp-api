const express = require('express');
const router = express.Router();
const Controller = require('../controllers/playlistController');
const { requireAuth } = require('../middleware/auth');

// Crear playlist
router.post("/",  Controller.createPlaylist);

// Obtener todas las playlists
router.get("/", Controller.getAllPlaylists);

// Obtener una playlist por ID
router.get("/:id", Controller.getPlaylistById);

// Agregar canción a playlist
router.post("/add-song",  Controller.addSongToPlaylist);
// Quitar canción de playlist
router.post("/remove-song",  Controller.removeSongFromPlaylist);

// Eliminar playlist
router.delete("/:id", Controller.deletePlaylist);

module.exports = router;
