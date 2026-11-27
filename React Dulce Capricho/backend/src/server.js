/**
 * Punto de entrada del backend: crea la app de express, configura
 * los middlewares, monta las rutas y escucha en el puerto del .env
 * (por defecto el 4000).
 */

//framework para crear el servidor HTTP y definir rutas
const express = require('express');
//middleware que habilita CORS (peticiones desde otro origen/puerto)
const cors = require('cors');
//lee el archivo .env y carga sus valores en process.env
require('dotenv').config();

//Importamos los routers de cada modulo
const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const categoriasRoutes = require('./routes/categorias.routes');

//creamos la aplicacion express
const app = express();

//cors() permite que el frontend (que corre en otro puerto)
//pueda hacer peticiones al backend sin que el navegador lo bloquee
app.use(cors());

//express.json() le enseña a express a leer el body de las peticiones
//cuando viene en formato json asi podemos leer req.body.email, etc
app.use(express.json());

//ruta de salud simple; util para probar que el servidor esta vivo
app.get('/', (req, res) => {
    res.json({ mensaje: 'API de Dulce Capricho funcionando correctamente' });
});

//todas las rutas que empiecen con /api/... se resuelven en su router
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);

//middleware para rutas que no existen (404)
app.use((req, res) => {
    res.status(404).json({ mensaje: 'ruta no encontrada' });
});

//tomamos el puerto desde .env o 4000 si no esta definido
const PORT = Number(process.env.PORT) || 4000;

//arranca el servidor: express queda escuchando peticiones HTTP
app.listen(PORT, () => {
    console.log(`servidor backend escuchando en http://localhost:${PORT}`);
});