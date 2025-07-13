const express = require('express');
const router = express.Router();
const {uploadFile , updateImage}=  require('../controllers/uploadController');
const upload = require('../middleware/multer');
const { requireAuth } = require('../middleware/auth');

router.post('/:tipo/:id', requireAuth, upload.single('file'),uploadFile);
// ✅ Ruta para actualizar imagen
router.put('/users/:id', requireAuth, upload.single('file'), updateImage);

module.exports = router;