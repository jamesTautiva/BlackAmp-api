const express = require('express');
const router = express.Router();
const controller = require('../controllers/albumContoller');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, controller.createAlbum);
router.get('/', controller.getAllAlbums);
router.get('/:id', controller.getAlbumById);
router.put('/:id', requireAuth, controller.updateAlbum);
router.delete('/:id', requireAuth, controller.deleteAlbum);

module.exports = router;
