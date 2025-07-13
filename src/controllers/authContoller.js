const { User } = require('../models');
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
