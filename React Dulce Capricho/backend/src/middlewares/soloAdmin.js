// Deja pasar solo a usuarios con rol Administrador
// Se usa DESPUES de verificarToken, que es quien llena req.usuario
function soloAdmin(req, res, next) {
  if (req.usuario?.rol !== 'Administrador') {
    return res.status(403).json({ mensaje: 'Acceso solo para administradores' });
  }
  next();
}

module.exports = soloAdmin;