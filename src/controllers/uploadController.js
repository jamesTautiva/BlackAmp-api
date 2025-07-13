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
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    // Aquí tu lógica para actualizar en la base de datos
    // y subir a Supabase/Storage

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/users/${id}_${Date.now()}${path.extname(file.originalname)}`;
    
    res.status(200).json({ 
      message: 'Imagen actualizada correctamente',
      imageUrl: publicUrl
    });
  } catch (err) {
    console.error('Error en updateImage:', err);
    res.status(500).json({ 
      error: 'Error al actualizar imagen',
      details: err.message
    });
  }
};
