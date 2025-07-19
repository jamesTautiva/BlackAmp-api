const { Album, Artist } = require('../models');

// Crear álbum (estado por defecto: pending)
exports.createAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    const artist = await Artist.findOne({ where: { userId } });

    if (!artist) {
      return res.status(403).json({ error: 'No tienes un perfil de artista' });
    }

    const album = await Album.create({
      ...req.body,
      artistId: artist.id,
      status: 'pending'
    });

    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los álbumes APROBADOS (para usuarios)
exports.getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({
      where: { status: 'approved' },
      include: [Artist]
    });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener álbum por ID (sin importar estado)
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id, { include: [Artist] });
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' });
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar álbum (usado por artistas, mantiene status 'pending')
exports.updateAlbum = async (req, res) => {
  try {
    const updated = await Album.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Álbum actualizado', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar álbum
exports.deleteAlbum = async (req, res) => {
  try {
    await Album.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Álbum eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: obtener álbumes pendientes
exports.getPendingAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({
      where: { status: 'pending' },
      include: [Artist]
    });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener álbumes pendientes', detail: err.message });
  }
};

// Admin: aprobar álbum
exports.approveAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' });

    album.status = 'approved';
    await album.save();
    res.json({ message: 'Álbum aprobado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al aprobar álbum', detail: err.message });
  }
};

// Admin: rechazar álbum
exports.rejectAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' });

    album.status = 'rejected';
    await album.save();
    res.json({ message: 'Álbum rechazado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al rechazar álbum', detail: err.message });
  }
};