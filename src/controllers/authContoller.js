const { User , Artist} = require('../models');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/hash');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email ya registrado' });
  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed, role });
  res.json({ user: { id: user.id, name: user.name, role: user.role } }, );
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const match = await comparePassword(password, user.password);
  if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      imageUrl: user.imageUrl  // 👈 Incluimos la foto de perfil
    }
  });
};

exports.users = async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'imageUrl'] });
  res.json(users);
}

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { name, email, password, role, imageUrl } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await hashPassword(password);
    if (role) user.role = role;
    if (imageUrl) user.imageUrl = imageUrl; // Si se actualiza por URL

    await user.save();
    res.json({ message: 'Usuario actualizado', user });

  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario', detail: err.message });
  }
};

// ✅ Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await User.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ message: 'Usuario eliminado correctamente' });

  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario', detail: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'role', 'imageUrl', 'createdAt']
    });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario', detail: err.message });
  }
};

exports.getUsersWithArtists = async (req, res) => {
  try {
    // Verifica que los modelos estén correctamente importados
    if (!User || !Artist) {
      throw new Error('Modelos no definidos');
    }

    // Obtiene usuarios con rol de artista y sus perfiles asociados
    const users = await User.findAll({
      where: { role: 'artist' },
      include: [{
        model: Artist,
        as: 'artist',
        required: false // Para incluir usuarios aunque no tengan perfil
      }],
      attributes: ['id', 'name', 'email', 'role'] // Selecciona solo los campos necesarios
    });

    // Filtra para devolver solo los usuarios con perfil de artista
    const usersWithArtists = users.filter(user => user.artist !== null);

    res.status(200).json(usersWithArtists);
  } catch (err) {
    console.error('Error en getUsersWithArtists:', err);
    res.status(500).json({ 
      error: 'Error al obtener artistas',
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.getAllArtistsWithUsers = async (req, res) => {
  try {
    const artists = await Artist.findAll({
      include: {
        model: User,
        attributes: ['id', 'email', 'role'], // puedes ajustar los campos
      },
    });
    res.json(artists);
  } catch (err) {
    console.error('Error al obtener artistas con usuarios:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
