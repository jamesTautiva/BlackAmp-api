const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { register, login, users, updateUser, deleteUser, getUserById, getUsersWithArtists } = require('../controllers/authContoller');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', users);
router.get('/:id', requireAuth, getUserById);
router.put('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, deleteUser);
router.get('/users-with-artists', requireAuth, getUsersWithArtists); // Nueva ruta


module.exports = router;