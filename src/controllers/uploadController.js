// src/controllers/uploadController.js
const supabase = require('../config/supabase');
const { User, Artist, Album, Song, Playlist } = require('../models');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const modelMap = {
  users: User,
  artists: Artist,
  albums: Album,
  songs: Song,
  playlists: Playlist
};

exports.uploadFile = async (req, res) => {
  try {
    const { tipo, id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Archivo no proporcionado' });
    }

    const model = modelMap[tipo];
    if (!model) {
      return res.status(400).json({ error: 'Tipo no válido' });
    }

    const entity = await model.findByPk(id);
    if (!entity) {
      return res.status(404).json({ error: `${tipo.slice(0, -1)} no encontrado` });
    }

    const extension = path.extname(file.originalname);
    const filename = `${tipo}/${id}_${uuidv4()}${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (uploadError) throw uploadError;

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/${filename}`;
    entity.imageUrl = publicUrl;
    await entity.save();

    return res.json({ message: 'Archivo subido', url: publicUrl });

  } catch (err) {
    console.error('Error en subida:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor', detail: err.message });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const { tipo, id } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'Archivo no proporcionado' });

    const model = modelMap[tipo];
    if (!model) return res.status(400).json({ error: 'Tipo no válido' });

    const entity = await model.findByPk(id);
    if (!entity) return res.status(404).json({ error: `${tipo.slice(0, -1)} no encontrado` });

    // 🔥 Eliminar imagen anterior si existe
    if (entity.imageUrl) {
      const parts = entity.imageUrl.split('/media/');
      if (parts.length === 2) {
        const previousPath = parts[1]; // tipo/id_uuid.ext
        await supabase.storage.from('media').remove([previousPath]);
      }
    }

    // 🆕 Subir nueva imagen
    const extension = path.extname(file.originalname);
    const filename = `${tipo}/${id}_${uuidv4()}${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (uploadError) throw uploadError;

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/${filename}`;
    entity.imageUrl = publicUrl;
    await entity.save();

    res.json({ message: 'Imagen actualizada correctamente', url: publicUrl });

  } catch (err) {
    console.error('Error al actualizar imagen:', err.message);
    res.status(500).json({ error: 'Error interno del servidor', detail: err.message });
  }
};
