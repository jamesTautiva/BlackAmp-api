const express = require('express');
const router = express.Router();
const controller = require('../controllers/albumContoller');
const { requireAuth, requireRole } = require('../middleware/auth');

// Rutas para usuarios autenticados
router.post('/', requireAuth, controller.createAlbum);
router.get('/', controller.getAllAlbums);
router.get('/:id', controller.getAlbumById);
router.put('/:id', requireAuth, controller.updateAlbum);
router.delete('/:id', requireAuth, controller.deleteAlbum);

// Rutas de moderación manual (solo admin)
router.get('/admin/pending', requireAuth, requireRole('admin'), controller.getPendingAlbums);
router.put('/admin/:id/approve', requireAuth, requireRole('admin'), controller.approveAlbum);
router.put('/admin/:id/reject', requireAuth, requireRole('admin'), controller.rejectAlbum);

module.exports = router;