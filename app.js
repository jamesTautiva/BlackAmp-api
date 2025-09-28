const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./src/config/database');

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://tu-frontend-produccion.com'], // orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // si usas cookies o auth headers
}));
// Middlewares
app.use(express.json());

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const artistRoutes = require('./src/routes/artistRoutes');
const albumRoutes = require('./src/routes/albumRoutes');
const songRoutes = require('./src/routes/songRoutes');
const playlistRoutes = require('./src/routes/playlistRoutes');
const analyticsRoutes = require('./src/routes/analytics');
const songPlayRoutes = require('./src/routes/songPlayRoutes');

app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/artists', artistRoutes);
app.use('/albums', albumRoutes);
app.use('/songs', songRoutes);
app.use('/playlists', playlistRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/songplays', songPlayRoutes);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('bienvenido a la api de BlackAmp!');
})

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
})
