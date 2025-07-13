const { PlaybackLog, Song, Sequelize } = require('../models');
const { Op } = require('sequelize');

exports.registerPlayback = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.user?.id || null;
    const deviceInfo = req.headers['user-agent'];
    const location = req.headers['x-country'] || 'unknown';

    await PlaybackLog.create({ songId, userId, deviceInfo, location });
    res.json({ message: 'Reproducción registrada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar reproducción', detail: err.message });
  }
};

exports.getTopSongs = async (req, res) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const data = await PlaybackLog.findAll({
      attributes: [
        'songId',
        [Sequelize.fn('COUNT', Sequelize.col('songId')), 'playCount']
      ],
      where: { timestamp: { [Op.gte]: weekAgo } },
      group: ['songId', 'Song.id'],
      include: { model: Song }
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas', detail: err.message });
  }
};