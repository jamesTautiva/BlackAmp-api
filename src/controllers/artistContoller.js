const { Artist, User } = require('../models');

exports.createArtistProfile = async (req, res) => {
  try {
    const { name, description, genere } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const artist = await Artist.create({ name, description, genere, userId });
    res.status(201).json(artist);
  } catch (err) {
    console.error('Error al crear artista:', err);
    res.status(500).json({ error: 'Error del servidor', detail: err.message });
  }
};


exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll({ include: [User] });
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id, { include: [User] });
    if (!artist) return res.status(404).json({ error: 'Artista no encontrado' });
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateArtist = async (req, res) => {
  try {
    const updated = await Artist.update(req.body, {
      where: { id: req.params.id, userId: req.user.id }
    });
    res.json({ message: 'Artista actualizado', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteArtist = async (req, res) => {
  try {
    await Artist.destroy({ where: { id: req.params.id, userId: req.user.id } });
    res.json({ message: 'Artista eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};