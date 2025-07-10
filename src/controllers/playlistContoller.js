const { Playlist, Song } = require('../models');

exports.createPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.create(req.body);
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.findAll({ include: Song });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id, { include: Song });
    if (!playlist) return res.status(404).json({ error: 'Playlist no encontrada' });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePlaylist = async (req, res) => {
  try {
    const updated = await Playlist.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Playlist actualizada', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    await Playlist.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Playlist eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
