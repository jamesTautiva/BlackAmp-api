const express = require('express');
const { subirArchivo } = require('../controllers/uploadController');
const upload = require('../middleware/multer');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/:tipo/:id', requireAuth, upload.single('file'), subirArchivo);

module.exports = router;