const pool = require('../config/db');

// Valores permitidos segun el ENUM de la tabla categorias
const ESTADOS = ['Activa', 'Inactiva'];

// Revisa los datos del formulario; devuelve un mensaje de error o null
function validarCategoria(body) {
  const { nombre_categoria, descripcion, estado } = body;

  if (!nombre_categoria || !String(nombre_categoria).trim()) {
    return 'El nombre de la categoria es obligatorio';
  }
  if (String(nombre_categoria).trim().length > 100) {
    return 'El nombre no puede pasar de 100 caracteres';
  }
  if (descripcion && String(descripcion).length > 200) {
    return 'La descripcion no puede pasar de 200 caracteres';
  }
  if (estado && !ESTADOS.includes(estado)) {
    return 'Estado no valido';
  }
  return null;
}

// Revisa si ya existe otra categoria con el mismo nombre
async function nombreRepetido(nombre, idExcluido = 0) {
  const [filas] = await pool.query(
    'SELECT id_categoria FROM categorias WHERE LOWER(nombre_categoria) = LOWER(?) AND id_categoria <> ?',
    [String(nombre).trim(), idExcluido]
  );
  return filas.length > 0;
}

// GET /api/categorias: todas, con cuantos productos tiene cada una
async function listar(req, res) {
  try {
    const [filas] = await pool.query(
      `SELECT c.id_categoria, c.nombre_categoria, c.descripcion, c.estado,
              COUNT(p.id_producto) AS total_productos
       FROM categorias c
       LEFT JOIN productos p ON p.id_categoria = c.id_categoria
       GROUP BY c.id_categoria, c.nombre_categoria, c.descripcion, c.estado
       ORDER BY c.nombre_categoria`
    );
    return res.json(filas);
  } catch (error) {
    console.error('Error listando categorias:', error);
    return res.status(500).json({ mensaje: 'error del servidor al listar categorias' });
  }
}

// POST /api/categorias
async function crear(req, res) {
  const errorValidacion = validarCategoria(req.body);
  if (errorValidacion) {
    return res.status(400).json({ mensaje: errorValidacion });
  }

  const { nombre_categoria, descripcion, estado } = req.body;

  try {
    if (await nombreRepetido(nombre_categoria)) {
      return res.status(409).json({ mensaje: 'Ya existe una categoria con ese nombre' });
    }

    const [resultado] = await pool.query(
      'INSERT INTO categorias (nombre_categoria, descripcion, estado) VALUES (?, ?, ?)',
      [String(nombre_categoria).trim(), descripcion || null, estado || 'Activa']
    );
    return res.status(201).json({ mensaje: 'Categoria creada', id_categoria: resultado.insertId });
  } catch (error) {
    console.error('Error creando categoria:', error);
    return res.status(500).json({ mensaje: 'error del servidor al crear la categoria' });
  }
}

// PUT /api/categorias/:id
async function actualizar(req, res) {
  const errorValidacion = validarCategoria(req.body);
  if (errorValidacion) {
    return res.status(400).json({ mensaje: errorValidacion });
  }

  const { nombre_categoria, descripcion, estado } = req.body;

  try {
    if (await nombreRepetido(nombre_categoria, Number(req.params.id))) {
      return res.status(409).json({ mensaje: 'Ya existe otra categoria con ese nombre' });
    }

    const [resultado] = await pool.query(
      'UPDATE categorias SET nombre_categoria = ?, descripcion = ?, estado = ? WHERE id_categoria = ?',
      [String(nombre_categoria).trim(), descripcion || null, estado || 'Activa', req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Categoria no encontrada' });
    }
    return res.json({ mensaje: 'Categoria actualizada' });
  } catch (error) {
    console.error('Error actualizando categoria:', error);
    return res.status(500).json({ mensaje: 'error del servidor al actualizar la categoria' });
  }
}

// PATCH /api/categorias/:id/estado: activa o desactiva (no se borra)
async function cambiarEstado(req, res) {
  const { estado } = req.body;

  if (!ESTADOS.includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado no valido' });
  }

  try {
    const [resultado] = await pool.query(
      'UPDATE categorias SET estado = ? WHERE id_categoria = ?',
      [estado, req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Categoria no encontrada' });
    }
    return res.json({ mensaje: `Categoria marcada como ${estado}` });
  } catch (error) {
    console.error('Error cambiando estado de categoria:', error);
    return res.status(500).json({ mensaje: 'error del servidor al cambiar el estado' });
  }
}

module.exports = { listar, crear, actualizar, cambiarEstado };