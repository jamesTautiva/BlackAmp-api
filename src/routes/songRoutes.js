const express = require('express');
const router = express.Router();
const controller = require('../controllers/songContoller');
const { requireAuth } = require('../middleware/auth');

router.post('/', controller.createSong);
router.get('/', controller.getAllSongs);
router.get('/:id', controller.getSongById);
router.put('/:id', requireAuth, controller.updateSong);
router.delete('/:id', requireAuth, controller.deleteSong);

module.exports = router;
