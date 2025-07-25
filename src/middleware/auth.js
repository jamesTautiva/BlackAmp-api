

const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    // Inyectamos todo el objeto user (con role incluido)
    req.user = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email
    };

    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
