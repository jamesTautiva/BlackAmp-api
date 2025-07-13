const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/multer');
const { requireAuth , requireAuth} = require('../middleware/auth');

router.post('/:tipo/:id', requireAuth, upload.single('file'), uploadController.uploadFile);
// ✅ Ruta para actualizar imagen
router.put('/:tipo/:id', requireAuth, upload.single('file'), updateImage);

module.exports = router;