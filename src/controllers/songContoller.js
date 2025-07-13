const { Song, Composer } = require('../models');

exports.createSong = async (req, res) => {
  try {
    const { title, audioUrl, composers } = req.body;

    if (!title || !composers || !Array.isArray(composers) || composers.length === 0) {
      return res.status(400).json({ error: 'El título y al menos un compositor son requeridos.' });
    }

    const song = await Song.create({ title, audioUrl });

    const composerInstances = await Promise.all(
      composers.map(async (name) => {
        const [composer] = await Composer.findOrCreate({ where: { name } });
        return composer;
      })
    );

    await song.addComposers(composerInstances);

    res.status(201).json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.findAll({
      include: Composer,
    });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id, {
      include: Composer,
    });
    if (!song) return res.status(404).json({ error: 'Canción no encontrada' });
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
      await song.setComposers(composerInstances); // reemplaza los compositores existentes
    }

    res.json({ message: 'Canción actualizada', song });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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