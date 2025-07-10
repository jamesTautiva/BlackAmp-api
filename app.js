const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./src/config/database');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('bienvenido a la api de BlackAmp!');
})

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
})
