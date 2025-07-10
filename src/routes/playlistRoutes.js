const express = require('express');
const router = express.Router();
const controller = require('../controllers/playlistContoller');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, controller.createPlaylist);
router.get('/', controller.getAllPlaylists);
router.get('/:id', controller.getPlaylistById);
router.put('/:id', requireAuth, controller.updatePlaylist);
router.delete('/:id', requireAuth, controller.deletePlaylist);

module.exports = router;
