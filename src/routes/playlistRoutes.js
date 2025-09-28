const express = require('express');
const router = express.Router();
const controller = require('../controllers/playlistContoller');
const { requireAuth } = require('../middleware/auth');

// Crear playlist
router.post("/",  playlistController.createPlaylist);

// Obtener todas las playlists
router.get("/", playlistController.getAllPlaylists);

// Obtener una playlist por ID
router.get("/:id", playlistController.getPlaylistById);

// Agregar canción a playlist
router.post("/add-song",  playlistController.addSongToPlaylist);
// Quitar canción de playlist
router.post("/remove-song",  playlistController.removeSongFromPlaylist);

// Eliminar playlist
router.delete("/:id", playlistController.deletePlaylist);

module.exports = router;
