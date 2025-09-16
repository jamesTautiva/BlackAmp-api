const express = require('express');
const router = express.Router();
const controller = require('../controllers/albumContoller');
const { requireAuth, requireAdminAuth } = require('../middleware/auth');

// Rutas públicas o para usuarios autenticados

// Crear un nuevo álbum (requiere perfil de artista)
router.post('/', controller.createAlbum);

// Obtener todos los álbumes aprobados (público)
router.get('/', controller.getAllAlbums);

// Obtener un álbum por ID (público)
router.get('/:id', controller.getAlbumById);

// Actualizar un álbum (solo artista dueño)
router.put('/:id', requireAuth, controller.updateAlbum);

// Eliminar un álbum (solo artista dueño)
router.delete('/:id', requireAuth, controller.deleteAlbum);


// --- Rutas para moderadores o administradores ---

// Obtener todos los álbumes pendientes (solo admin)
router.get('/admin/albums/pending', requireAuth, requireAdminAuth, controller.getPendingAlbums);

// Aprobar un álbum por ID (solo admin)
router.put('/admin/albums/:id/approve', requireAuth, requireAdminAuth, controller.approveAlbum);

// Rechazar un álbum por ID (solo admin)
router.put('/admin/albums/:id/reject', requireAuth, requireAdminAuth, controller.rejectAlbum);

// obtener albums por artista ID
router.get('/artist/:artistId', controller.getAlbumsByArtist);

module.exports = router;
