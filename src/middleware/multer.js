const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: './tmp',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const valid = ['image/jpeg', 'image/png', 'audio/wav'];
    valid.includes(file.mimetype) ? cb(null, true) : cb(new Error('Tipo no permitido'));
  },
});

module.exports = upload;