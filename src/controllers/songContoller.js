const { Song, Composer, Album, Artist } = require('../models');

// Crear canción
exports.createSong = async (req, res) => {
  try {
    const { title, audioUrl, albumId, artistId, composers, trackNumber, explicit, license, licenseUrl } = req.body;


    // Verifica que el álbum exista
    const album = await Album.findByPk(albumId);
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' });

    // Verifica que el artista exista
    const artist = await Artist.findByPk(artistId);
    if (!artist) return res.status(404).json({ error: 'Artista no encontrado' });

    // Crea la canción
    const song = await Song.create({ 
      title, 
      audioUrl, 
      albumId, 
      artistId,
      trackNumber: trackNumber || null,
      explicit: explicit || false,
      license: license || 'CC-BY',
      licenseUrl: licenseUrl || ''
    });

    // Crear o encontrar compositores
    const composerInstances = await Promise.all(
      composers.map(async (name) => {
        const [composer] = await Composer.findOrCreate({ where: { name } });
        return composer;
      })
    );

    await song.addComposers(composerInstances);

    const songWithComposers = await Song.findByPk(song.id, {
      include: [{ model: Composer, as: 'composers', through: { attributes: [] } }]
    });

    res.status(201).json(songWithComposers);
  } catch (err) {
    console.error('Error creating song:', err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener todas las canciones
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.findAll({
      include: [
        {
          model: Composer,
          as: 'composers',
          through: { attributes: [] }
        },
        {
          model: Album,
          as: 'album',
          attributes: ['id', 'title']
        },
        {
          model: Artist,
          as: 'artist',
          attributes: ['id', 'name']
        }
      ]
    });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener canción por ID
exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id, {
      include: [
        { model: Composer, as: 'composers', through: { attributes: [] } },
        { model: Album, as: 'album', attributes: ['id', 'title'] },
        { model: Artist, as: 'artist', attributes: ['id', 'name'] }
      ]
    });
    if (!song) return res.status(404).json({ error: 'Canción no encontrada' });
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar canción
exports.updateSong = async (req, res) => {
  try {
    const { title, audioUrl, composers } = req.body;

    const song = await Song.findByPk(req.params.id);
    if (!song) return res.status(404).json({ error: 'Canción no encontrada' });

    await song.update({ title, audioUrl });

    if (composers && Array.isArray(composers)) {
      const composerInstances = await Promise.all(
        composers.map(async (name) => {
          const [composer] = await Composer.findOrCreate({ where: { name } });
          return composer;
        })
      );
      await song.setComposers(composerInstances);
    }

    const updatedSong = await Song.findByPk(song.id, {
      include: [{ model: Composer, as: 'composers', through: { attributes: [] } }]
    });

    res.json({ message: 'Canción actualizada', song: updatedSong });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar canción
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) return res.status(404).json({ error: 'Canción no encontrada' });

    await song.setComposers([]); // desvincula los compositores
    await song.destroy();

    res.json({ message: 'Canción eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
