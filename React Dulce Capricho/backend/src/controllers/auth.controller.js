/**
 * aqui vive la logica de negocio del login: recibir email
 * y contraseña, buscar el usuario en mysql, comparar la contraseña
 * encriptada y devolver un token JWT si todo es correcto.
 */

//libreria para comparar la contraseña encriptada
const bcrypt = require('bcryptjs');
//libreria para crear (firmar) tokens JWT de sesion
const jwt = require('jsonwebtoken');
//pool para conexiones mysql configurado en config/db.js
const pool = require('../config/db');
//carga las variables de .env (JWT_SECRET, JWT_EXPIRES_IN)
require('dotenv').config();

//POST /api/auth/login
//Recibe {email, password} y devuelve {token, usuario} si son correctos
async function login(req, res) {
    try {
        //extraemos el email y password del cuerpo (body) de la peticion
        const { email, password } = req.body;

        //1 validacion basica: que no llegue el formulario vacio
        if (!email || !password) {
            return res.status(400).json({
                mensaje: 'el correo y la contraseña son obligatorios'
            });
        }

        //2 buscar el usuario por correo en la tabla usuarios
        //hacemos JOIN con roles para obtener el nombre del rol
        //usamos "?" para evitar inyeccion SQL
        const [filas] = await pool.query(
            `SELECT u.id_usuario, u.nombres, u.apellidos, u.correo,
                    u.contrasena, u.estado, r.nombre_rol AS rol
             FROM usuarios u
             JOIN roles r ON r.id_rol = u.id_rol
             WHERE u.correo = ? LIMIT 1`,
            [email]
        );

        //si no encontro ninguna fila, el correo no existe
        if (filas.length === 0) {
            return res.status(401).json({ mensaje: 'correo o contraseña incorrectos' });
        }

        const usuario = filas[0];

        //si el usuario esta inactivo no lo dejamos iniciar sesion
        //aunque la contraseña sea correcta
        if (usuario.estado !== 'Activo') {
            return res.status(403).json({ mensaje: 'este usuario esta desactivado. contacte al administrador' });
        }

        //comparar la contraseña que envio el formulario con el hash
        //guardado en la base de datos
        const passwordCorrecta = await bcrypt.compare(password, usuario.contrasena);
        if (!passwordCorrecta) {
            return res.status(401).json({ mensaje: 'correo o contraseña incorrectos' });
        }

        //generar el token JWT que el frontend guardara para
        //demostrar en cada peticion futura que ya inicio sesion
        const token = jwt.sign(
            { id: usuario.id_usuario, email: usuario.correo, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

        //responder token con los datos publicos del usuario
        //NUNCA se devuelve el hash de la contraseña al frontend
        return res.json({
            token,
            usuario: {
                id: usuario.id_usuario,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                email: usuario.correo,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ mensaje: 'error del servidor al iniciar sesion' });
    }
}

//GET /api/auth/perfil
//Ruta protegida de ejemplo solo responde a personas si el middleware
//verificarToken confirmo que el token es valido
async function perfil(req, res) {
    //req.usuario fue puesto por el middleware verificarToken
    return res.json({ usuario: req.usuario });
}

//exportamos ambas funciones para que auth.routes.js pueda conectarlas con las urls
module.exports = {
    login,
    perfil,
};