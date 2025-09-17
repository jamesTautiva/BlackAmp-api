const { Album, Artist } = require('../models');

// Crear álbum (estado por defecto: pending)
exports.createAlbum = async (req, res) => {
  try {
    const { title, year, producer, genre, coverUrl, license, licenseUrl } = req.body;

    if (!title || !genre || !license || !licenseUrl || !year) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // 🔥 Buscar el artista asociado al usuario autenticado
    const artist = await Artist.findOne({ where: { userId: req.user.id } });
    if (!artist) {
      return res.status(403).json({ error: 'No tienes un perfil de artista' });
    }

    const album = await Album.create({
      title,
      year,
      producer,
      genre,
      coverUrl,
      license,
      licenseUrl,
      artistId: artist.id,   // 🔥 forzado desde el usuario
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

// Subir portada de álbum
exports.uploadAlbumCover = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No se recibió archivo' });

    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `albums/${id}/cover.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('albums')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from('albums')
      .getPublicUrl(fileName);

    // actualizar el álbum con la URL pública
    await Album.update({ coverUrl: publicUrl.publicUrl }, { where: { id } });

    res.json({ message: 'Portada subida', url: publicUrl.publicUrl });
  } catch (err) {
    res.status(500).json({ error: 'Error al subir portada', detail: err.message });
  }
};
