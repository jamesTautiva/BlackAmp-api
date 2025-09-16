const { Album, Artist } = require('../models');

// Crear álbum (estado por defecto: pending)
exports.createAlbum = async (req, res) => {
  try {
    const { title, year, producer, genre, coverUrl, license, licenseUrl, artistId } = req.body;

    if (!title || !genre || !license || !licenseUrl || !year || !artistId) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Validar que el artista existe
    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return res.status(404).json({ error: 'Artista no encontrado' });
    }

    // Opcional: validar si el usuario tiene permiso para crear álbum para ese artista
    // Solo si deseas restringir a admins o al mismo artista:
    // if (artist.userId !== req.user.id && req.user.role !== 'admin') {
    //   return res.status(403).json({ error: 'No autorizado para crear álbum para este artista' });
    // }

    const album = await Album.create({
      title,
      year,
      producer,
      genre,
      coverUrl,
      license,
      licenseUrl,
      artistId: artist.id,
      status: 'pending'
    });

    res.status(201).json({ message: 'Álbum creado exitosamente', album });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear álbum', detail: err.message });
  }
};
// Obtener todos los álbumes aprobados
exports.getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({
      where: { status: 'approved' },
      include: [{ model: Artist, as: 'artist' }]
    });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener álbumes', detail: err.message });
  }
};

// Obtener álbum por ID
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id, {
      include: [{ model: Artist, as: 'artist' }]
    });
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' });
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener álbum', detail: err.message });
  }
};

// Actualizar álbum (solo campos permitidos)
exports.updateAlbum = async (req, res) => {
  try {
    const { title, description, genre, coverUrl, license, licenseUrl } = req.body;

    const [updated] = await Album.update(
      { title, description, genre, coverUrl, license, licenseUrl },
      { where: { id: req.params.id } }
    );

    if (!updated) return res.status(404).json({ error: 'Álbum no encontrado' });

    res.json({ message: 'Álbum actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar álbum', detail: err.message });
  }
};

// Eliminar álbum
exports.deleteAlbum = async (req, res) => {
  try {
    const deleted = await Album.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Álbum no encontrado' });
    res.json({ message: 'Álbum eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar álbum', detail: err.message });
  }
};

// Obtener álbumes pendientes (para moderadores)
exports.getPendingAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({
      where: { status: 'pending' },
      include: [
        {
          model: Artist,
          as: 'artist', // 👈 importante usar el alias correcto
          attributes: ['id', 'name'] // solo traemos lo necesario
        }
      ]
    });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener álbumes pendientes', detail: err.message });
  }
};

// traer álbum pendiente por ID (opcional, si necesitas detalles específicos) sin importar el estado
// Obtener un álbum por ID
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id, {
      include: [{ model: Artist, as: 'artist' }]
    });
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' });
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener álbum', detail: err.message });
  }
};

// Obtener todos los álbumes de un artista
exports.getAlbumsByArtistId = async (req, res) => {
  try {
    const { artistId } = req.params;
    const albums = await Album.findAll({
      where: { artistId },
      include: [{ model: Artist, as: 'artist' }]
    });

    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener álbumes del artista', detail: err.message });
  }
};

// Aprobar álbum
exports.approveAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' });

    album.status = 'approved';
    await album.save();
    res.json({ message: 'Álbum aprobado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al aprobar álbum', detail: err.message });
  }
};

// Rechazar álbum
exports.rejectAlbum = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' });

    album.status = 'rejected';
    await album.save();
    res.json({ message: 'Álbum rechazado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al rechazar álbum', detail: err.message });
  }
};
