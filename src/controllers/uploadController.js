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
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const filePath = `${tipo}/${Date.now()}_${req.file.originalname}`;

    // Subir archivo a Supabase Storage
    const { error } = await supabase.storage
      .from('uploads')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) throw error;

    // Generar URL pública
    const { publicUrl } = supabase.storage.from('uploads').getPublicUrl(filePath).data;

    // ✅ Actualizar en BD según el tipo
    if (tipo === 'albums') {
      await Album.update({ coverUrl: publicUrl }, { where: { id } });
    } else if (tipo === 'artists') {
      await Artist.update({ imageUrl: publicUrl }, { where: { id } });
    } else if (tipo === 'users') {
      await User.update({ imageUrl: publicUrl }, { where: { id } });
    } else if (tipo === 'songs') {
      await Song.update({ fileUrl: publicUrl }, { where: { id } });
    }

    res.json({ message: 'Archivo subido correctamente', url: publicUrl });
  } catch (err) {
    res.status(500).json({ error: 'Error al subir archivo', detail: err.message });
  }
};

exports.updateImage = async (req, res) => {
  try {
    // Obtener tipo de parámetro o determinar por defecto
    let { tipo = 'users', id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    // Validar tipo
    const validTypes = ['users', 'artists', 'albums', 'songs', 'playlists'];
    if (!validTypes.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo no válido' });
    }

    const model = modelMap[tipo];
    if (!model) {
      return res.status(400).json({ error: 'Tipo no soportado' });
    }

    const entity = await model.findByPk(id);
    if (!entity) {
      return res.status(404).json({ error: `${tipo.slice(0, -1)} no encontrado` });
    }

    // Eliminar imagen anterior si existe
    if (entity.imageUrl) {
      const parts = entity.imageUrl.split('/storage/v1/object/public/media/');
      if (parts.length === 2) {
        const filePath = parts[1];
        await supabase.storage.from('media').remove([filePath]);
      }
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