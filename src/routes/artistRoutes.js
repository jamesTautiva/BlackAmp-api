const express = require('express');
const router = express.Router();
const controller = require('../controllers/artistContoller');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, controller.createArtistProfile);
router.get('/', controller.getAllArtists);
router.get('/:id', controller.getArtistById);
router.put('/:id', requireAuth, controller.updateArtist);
router.delete('/:id', requireAuth, controller.deleteArtist);

module.exports = router;
