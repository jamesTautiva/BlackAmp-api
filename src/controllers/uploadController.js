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