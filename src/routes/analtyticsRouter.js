const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/top-songs", statsController.topSongs);
router.get("/top-artists", statsController.topArtists);
router.get("/top-albums", statsController.topAlbums);
router.get("/user-stats", authMiddleware, statsController.userStats);
router.get("/monthly-plays", statsController.monthlyPlays);
router.get("/artist/:artistId/stats", statsController.artistStats);
module.exports = router;