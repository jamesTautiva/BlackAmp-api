const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./src/config/database');

const app = express();
app.use(cors());
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

app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/artists', artistRoutes);
app.use('/albums', albumRoutes);
app.use('/songs', songRoutes);
app.use('/playlists', playlistRoutes);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('bienvenido a la api de BlackAmp!');
})

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
})
