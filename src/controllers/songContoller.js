const { Song, Composer, Album, Artist } = require('../models');

// Crear canción
exports.createSong = async (req, res) => {
  try {
    const { title, audioUrl, albumId, composers } = req.body;

    if (!title || !composers || !Array.isArray(composers) || composers.length === 0) {
      return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

  

    const album = await Album.findOne({ where: { id: albumId} });
    if (!album) return res.status(403).json({ error: 'El álbum no pertenece a tu perfil' });

    const song = await Song.create({ title, audioUrl, albumId});

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
