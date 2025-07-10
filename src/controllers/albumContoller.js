const { Album } = require('../models');

exports.createAlbum = async (req, res) => {
  try {
    const album = await Album.create(req.body);
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll();
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' });
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const updated = await Album.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Álbum actualizado', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    await Album.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Álbum eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
