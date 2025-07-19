const express = require('express');
const router = express.Router();
const controller = require('../controllers/artistContoller');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, controller.createArtistProfile);
router.get('/', controller.getAllArtists);
router.get('/:id', controller.getArtistById);
router.put('/:id', requireAuth, controller.updateArtist);
router.delete('/:id', requireAuth, controller.deleteArtist);
router.get('/user/:userId', controller.getArtistByUserId); // Nueva ruta importante
// Ruta para obtener usuario con datos de artista
router.get('/user-with-artist/:userId', controller.getUserWithArtist);

module.exports = router;
