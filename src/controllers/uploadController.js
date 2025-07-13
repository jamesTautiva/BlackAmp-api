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

// Función para eliminar imagen anterior de Supabase
const deletePreviousImage = async (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    const parts = imageUrl.split('/storage/v1/object/public/media/');
    if (parts.length === 2) {
      const filePath = parts[1];
      const { error } = await supabase.storage
        .from('media')
        .remove([filePath]);
      
      if (error) console.warn('No se pudo eliminar imagen anterior:', error.message);
    }
  } catch (err) {
    console.error('Error eliminando imagen anterior:', err);
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

    // Eliminar imagen anterior si existe
    if (entity.imageUrl) {
      await deletePreviousImage(entity.imageUrl);
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

    return res.json({ 
      success: true,
      message: 'Archivo subido correctamente', 
      imageUrl: publicUrl 
    });

  } catch (err) {
    console.error('Error en subida:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor', 
      details: err.message 
    });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const { tipo, id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    const model = modelMap[tipo];
    if (!model) {
      return res.status(400).json({ error: 'Tipo no válido' });
    }

    const entity = await model.findByPk(id);
    if (!entity) {
      return res.status(404).json({ error: `${tipo.slice(0, -1)} no encontrado` });
    }

    // Eliminar imagen anterior si existe
    if (entity.imageUrl) {
      await deletePreviousImage(entity.imageUrl);
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

    return res.status(200).json({ 
      success: true,
      message: 'Imagen actualizada correctamente',
      imageUrl: publicUrl
    });

  } catch (err) {
    console.error('Error en updateImage:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Error al actualizar imagen',
      details: err.message
    });
  }
};