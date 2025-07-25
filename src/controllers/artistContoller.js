const { Artist, User } = require('../models');
const { users } = require('./authContoller');

exports.createArtistProfile = async (req, res) => {
  try {
    const { name, description, genere, userId: bodyUserId } = req.body;
    const authUser = req.user;

    // Si es admin y manda userId, úsalo. Si no, usa su propio ID
    const userId = authUser.role === 'admin' && bodyUserId
      ? parseInt(bodyUserId)
      : authUser.id;

    // Verifica que el usuario ya no tenga un perfil de artista
    const existingArtist = await Artist.findOne({ where: { userId } });
    if (existingArtist) {
      return res.status(400).json({ error: 'Este usuario ya tiene un perfil de artista' });
    }

    const artist = await Artist.create({ name, description, genere, userId });
    console.log('Artista creado:', artist.toJSON());

    res.status(201).json(artist);
  } catch (err) {
    console.error('Error al crear artista:', err);
    res.status(500).json({ error: 'Error del servidor', detail: err.message });
  }
};

exports.getArtistByUserId = async (req, res) => {
  try {
    const artist = await Artist.findOne({ 
      where: { userId: req.params.userId },
      include: [{ model: User, as: 'user' }]
    });
    
    if (!artist) {
      return res.status(404).json({ error: 'Artista no encontrado' });
    }
    
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserWithArtist = async (req, res) => {
  try {
    const { userId } = req.params;

    // Usa el mismo alias 'artist' que definiste en la asociación
    const userWithArtist = await User.findOne({
      where: { id: userId },
      include: [{
        model: Artist,
        as: 'artist', // Debe coincidir exactamente con el alias en la asociación
        required: false
      }]
    });

    if (!userWithArtist) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (!userWithArtist.artist) {
      return res.status(404).json({ error: 'Este usuario no tiene perfil de artista' });
    }

    res.json({
      user: {
        id: userWithArtist.id,
        name: userWithArtist.name,
        email: userWithArtist.email,
        role: userWithArtist.role
      },
      artist: userWithArtist.artist // Cambiado de artistProfile a artist
    });
  } catch (err) {
    console.error('Error en getUserWithArtist:', err);
    res.status(500).json({ 
      error: 'Error al obtener usuario con artista',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};



exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll({
      include: [{ model: User, as: 'user' }]
    });
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user', // Usa el alias exacto usado en la asociación
          required: false,
        },
      ],
    });

    if (!artist) return res.status(404).json({ error: 'Artista no encontrado' });
    res.json(artist);
  } catch (err) {
    console.error('❌ Error en getArtistById:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
exports.updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);

    if (!artist) {
      return res.status(404).json({ error: 'Artista no encontrado' });
    }

    // Si no es admin, verificar que el artista le pertenezca
    if (req.user.role !== 'admin' && artist.userId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado para actualizar este artista' });
    }

    const {
      name,
      description,
      genere,
      facebook,
      instagram,
      youtube
    } = req.body;

    artist.name = name ?? artist.name;
    artist.description = description ?? artist.description;
    artist.genere = genere ?? artist.genere;
    artist.facebook = facebook ?? artist.facebook;
    artist.instagram = instagram ?? artist.instagram;
    artist.youtube = youtube ?? artist.youtube;

    await artist.save();

    res.json({ message: 'Artista actualizado', artist });
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