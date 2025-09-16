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

// Función genérica para manejar subida/actualización
const handleUpload = async ({ tipo, id, file }) => {
  if (!file) throw new Error('No se proporcionó archivo');

  const validTypes = Object.keys(modelMap);
  if (!validTypes.includes(tipo)) throw new Error('Tipo no válido');

  const model = modelMap[tipo];
  const entity = await model.findByPk(id);
  if (!entity) throw new Error(`${tipo.slice(0, -1)} no encontrado`);

  // Eliminar imagen anterior si existe
  if (entity.imageUrl) {
    const parts = entity.imageUrl.split('/storage/v1/object/public/media/');
    if (parts.length === 2) {
      const filePath = parts[1];
      await supabase.storage.from('media').remove([filePath]);
    }
  }

  // Nombre del archivo
  const extension = path.extname(file.originalname);
  const filename = `${tipo}/${id}_${uuidv4()}${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (uploadError) throw new Error(uploadError.message);

  // Guardar URL pública
  const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/${filename}`;
  entity.imageUrl = publicUrl;
  await entity.save();

  return { entity, publicUrl };
};

// Controlador genérico: Upload
exports.uploadFile = async (req, res) => {
  try {
    const { tipo, id } = req.params;
    const file = req.file;

    const { entity, publicUrl } = await handleUpload({ tipo, id, file });

    return res.json({
      success: true,
      message: 'Archivo subido correctamente',
      imageUrl: publicUrl,
      data: entity
    });
  } catch (err) {
    console.error('Error en uploadFile:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Controlador genérico: Update
exports.updateImage = async (req, res) => {
  try {
    const { tipo, id } = req.params;
    const file = req.file;

    const { entity, publicUrl } = await handleUpload({ tipo, id, file });

    return res.json({
      success: true,
      message: 'Imagen actualizada correctamente',
      imageUrl: publicUrl,
      data: entity
    });
  } catch (err) {
    console.error('Error en updateImage:', err);
    return res.status(500).json({ error: err.message });
  }
};