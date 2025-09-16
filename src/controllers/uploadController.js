const supabase = require('../config/supabase');
const { User, Artist, Album, Song, Playlist } = require('../models');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const modelMap = {
  users: User,
  artists: Artist,
  albums: Album,
  songs: Song,
  playlists: Playlist,
};

// Mapea qué campo actualizar según tipo
const fieldMap = {
  users: 'imageUrl',
  artists: 'imageUrl',
  playlists: 'imageUrl',
  albums: 'coverUrl',
  songs: 'fileUrl', // 👈 audio
};

// Función para eliminar archivo anterior de Supabase
const deletePreviousFile = async (url) => {
  if (!url) return;
  try {
    const parts = url.split('/storage/v1/object/public/media/');
    if (parts.length === 2) {
      const filePath = parts[1];
      const { error } = await supabase.storage
        .from('media')
        .remove([filePath]);

      if (error) console.warn('No se pudo eliminar archivo anterior:', error.message);
    }
  } catch (err) {
    console.error('Error eliminando archivo anterior:', err);
  }
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

    const fieldName = fieldMap[tipo];
    if (!fieldName) {
      return res.status(400).json({ error: 'Tipo sin campo asociado' });
    }

    // Eliminar archivo anterior si existe
    if (entity[fieldName]) {
      await deletePreviousFile(entity[fieldName]);
    }

    const extension = path.extname(file.originalname);
    const filename = `${tipo}/${id}_${uuidv4()}${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/${filename}`;
    entity[fieldName] = publicUrl;
    await entity.save();

    return res.json({
      success: true,
      message: 'Archivo subido correctamente',
      url: publicUrl,
    });
  } catch (err) {
    console.error('Error en subida:', err);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: err.message,
    });
  }
};

exports.updateImage = async (req, res) => {
  try {
    let { tipo = 'users', id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    const model = modelMap[tipo];
    if (!model) {
      return res.status(400).json({ error: 'Tipo no soportado' });
    }

    const entity = await model.findByPk(id);
    if (!entity) {
      return res.status(404).json({ error: `${tipo.slice(0, -1)} no encontrado` });
    }

    const fieldName = fieldMap[tipo];
    if (!fieldName) {
      return res.status(400).json({ error: 'Tipo sin campo asociado' });
    }

    // Eliminar archivo anterior si existe
    if (entity[fieldName]) {
      await deletePreviousFile(entity[fieldName]);
    }

    const extension = path.extname(file.originalname);
    const filename = `${tipo}/${id}_${uuidv4()}${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/${filename}`;
    entity[fieldName] = publicUrl;
    await entity.save();

    return res.status(200).json({
      success: true,
      message: 'Archivo actualizado correctamente',
      url: publicUrl,
    });
  } catch (err) {
    console.error('Error en updateFile:', err);
    return res.status(500).json({
      success: false,
      error: 'Error al actualizar archivo',
      details: err.message,
    });
  }
};
