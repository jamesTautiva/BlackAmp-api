const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { register, login, users, updateUser, deleteUser } = require('../controllers/authContoller');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', users);
router.put('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, deleteUser);

module.exports = router;