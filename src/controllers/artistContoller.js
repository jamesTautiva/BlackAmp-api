const { Artist, User } = require('../models');

exports.createArtistProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user || user.role !== 'artist') {
      return res.status(403).json({ error: 'No autorizado. Solo usuarios artistas pueden crear perfiles' });
    }

    const exists = await Artist.findOne({ where: { userId } });
    if (exists) return res.status(400).json({ error: 'Ya tienes un perfil de artista' });

    const artist = await Artist.create({
      ...req.body,
      userId,
    });

    res.status(201).json(artist);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear perfil', detail: err.message });
  }
};

exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artista no encontrado' });
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateArtist = async (req, res) => {
  try {
    const updated = await Artist.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Artista actualizado', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteArtist = async (req, res) => {
  try {
    await Artist.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Artista eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
