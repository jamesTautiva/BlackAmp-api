const fs = require('fs');
const supabase = require('../config/supabase');
const db = require('../models');

exports.subirArchivo = async (req, res) => {
  const { tipo, id } = req.params;
  const archivo = req.file;
  if (!archivo) return res.status(400).json({ error: 'Archivo requerido' });

  const buffer = fs.readFileSync(archivo.path);
  const filename = `${tipo}/${Date.now()}-${archivo.originalname}`;
  const { data, error } = await supabase.storage.from('media').upload(filename, buffer, {
    contentType: archivo.mimetype,
  });

  fs.unlinkSync(archivo.path);
  if (error) return res.status(500).json({ error: error.message });

  const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/${filename}`;

  const updates = {
    users: () => db.User.update({ imageUrl: url }, { where: { id } }),
    artists: () => db.Artist.update({ imageUrl: url }, { where: { id } }),
    albums: () => db.Album.update({ coverUrl: url }, { where: { id } }),
    songs: () => db.Song.update({ audioUrl: url }, { where: { id } }),
    playlists: () => db.Playlist.update({ imageUrl: url }, { where: { id } }),
  };

  if (!updates[tipo]) return res.status(400).json({ error: 'Tipo inválido' });

  await updates[tipo]();
  res.json({ message: 'Archivo subido', url });
};