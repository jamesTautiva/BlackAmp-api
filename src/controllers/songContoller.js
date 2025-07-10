const { Song } = require('../models');

exports.createSong = async (req, res) => {
  try {
    const song = await Song.create(req.body);
    res.status(201).json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.findAll();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) return res.status(404).json({ error: 'Canción no encontrada' });
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSong = async (req, res) => {
  try {
    const updated = await Song.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Canción actualizada', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSong = async (req, res) => {
  try {
    await Song.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Canción eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
