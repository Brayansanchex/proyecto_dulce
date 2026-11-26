// Script que crea el usuario administrador inicial de Dulce Capricho.
// Se ejecuta una sola vez con: npm run seed

// Libreria para encriptar la contraseña antes de guardarla
const bcrypt = require('bcryptjs');
// Carga las variables de .env (datos del usuario semilla)
require('dotenv').config();
// Pool de conexiones a MySQL (mismo que usa el resto del backend)
const pool = require('./src/config/db');

// Funcion principal: crea el usuario administrador si no existe
async function crearUsuarioAdmin() {
  // Tomamos los datos del admin desde el .env para no dejarlos "quemados" en el codigo
  const nombres = process.env.SEED_ADMIN_NOMBRES || 'Administradora';
  const apellidos = process.env.SEED_ADMIN_APELLIDOS || 'Dulce Capricho';
  const correo = process.env.SEED_ADMIN_EMAIL || 'admin@dulcecapricho.com';
  const passwordPlano = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';

  try {
    // Revisamos si ya existe un usuario con ese correo, para no duplicarlo
    const [existentes] = await pool.query(
      'SELECT id_usuario FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (existentes.length > 0) {
      console.log(`El usuario ${correo} ya existe. No se crea de nuevo.`);
      process.exit(0);
    }

    // bcrypt.hash("texto", saltRounds) genera un hash irreversible
    const passwordEncriptada = await bcrypt.hash(passwordPlano, 10);

    // Insertamos el usuario con rol 1 (Administrador) y la contraseña encriptada
    await pool.query(
      `INSERT INTO usuarios (id_rol, nombres, apellidos, correo, contrasena, estado)
       VALUES (1, ?, ?, ?, ?, 'Activo')`,
      [nombres, apellidos, correo, passwordEncriptada]
    );

    // Mostramos las credenciales en texto plano SOLO para poder copiarlas;
    // en la base de datos ya quedo encriptada.
    console.log('Usuario administrador creado con exito:');
    console.log(`  Correo:   ${correo}`);
    console.log(`  Password: ${passwordPlano} (guardada encriptada en la base de datos)`);
    process.exit(0);
  } catch (error) {
    // Si algo fallo (MySQL apagado, tabla inexistente, etc.) lo mostramos
    console.error('Error creando el usuario administrador:', error);
    process.exit(1);
  }
}

// Ejecutamos la funcion apenas se corre "node seed.js" / "npm run seed"
crearUsuarioAdmin();