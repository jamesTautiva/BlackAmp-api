const express = require('express');
const router = express.Router();
const controller = require('../controllers/analyticsController');
const { requireAuth } = require('../middleware/auth');

router.post('/play', requireAuth, controller.registerPlayback);
router.get('/top-songs', controller.getTopSongs);

module.exports = router;