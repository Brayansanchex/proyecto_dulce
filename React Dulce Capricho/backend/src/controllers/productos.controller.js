const pool = require('../config/db');

// Valores permitidos segun los ENUM de la tabla productos
const TAMANOS = ['Pequeno', 'Mediano', 'Grande'];
const ESTADOS = ['Disponible', 'No disponible'];

// Revisa los datos que llegan del formulario; devuelve un mensaje de error o null
function validarProducto(body) {
  const { nombre_producto, id_categoria, precio, stock, tamano, estado } = body;

  if (!nombre_producto || !String(nombre_producto).trim()) {
    return 'El nombre del producto es obligatorio';
  }
  if (!id_categoria) {
    return 'Debes elegir una categoria';
  }
  if (precio === undefined || precio === '' || Number.isNaN(Number(precio)) || Number(precio) < 0) {
    return 'El precio debe ser un numero mayor o igual a 0';
  }
  const stockNumero = Number(stock ?? 0);
  if (!Number.isInteger(stockNumero) || stockNumero < 0) {
    return 'El stock debe ser un numero entero mayor o igual a 0';
  }
  if (tamano && !TAMANOS.includes(tamano)) {
    return 'Tamano no valido';
  }
  if (estado && !ESTADOS.includes(estado)) {
    return 'Estado no valido';
  }
  return null;
}

// GET /api/productos: todos los productos con el nombre de su categoria
async function listar(req, res) {
  try {
    const [filas] = await pool.query(
      `SELECT p.id_producto, p.id_categoria, c.nombre_categoria,
              p.nombre_producto, p.descripcion, p.sabor, p.tamano,
              p.precio, p.stock, p.personalizado, p.imagen,
              p.estado, p.fecha_registro
       FROM productos p
       JOIN categorias c ON c.id_categoria = p.id_categoria
       ORDER BY p.id_producto DESC`
    );
    return res.json(filas);
  } catch (error) {
    console.error('Error listando productos:', error);
    return res.status(500).json({ mensaje: 'error del servidor al listar productos' });
  }
}

// POST /api/productos: crea un producto
async function crear(req, res) {
  const errorValidacion = validarProducto(req.body);
  if (errorValidacion) {
    return res.status(400).json({ mensaje: errorValidacion });
  }

  const { id_categoria, nombre_producto, descripcion, sabor, tamano, precio, stock, personalizado, imagen, estado } = req.body;

  try {
    const [resultado] = await pool.query(
      `INSERT INTO productos
        (id_categoria, nombre_producto, descripcion, sabor, tamano, precio, stock, personalizado, imagen, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_categoria,
        String(nombre_producto).trim(),
        descripcion || null,
        sabor || null,
        tamano || null,
        Number(precio),
        Number(stock ?? 0),
        personalizado ? 1 : 0,
        imagen || null,
        estado || 'Disponible',
      ]
    );
    return res.status(201).json({ mensaje: 'Producto creado', id_producto: resultado.insertId });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ mensaje: 'La categoria elegida no existe' });
    }
    console.error('Error creando producto:', error);
    return res.status(500).json({ mensaje: 'error del servidor al crear el producto' });
  }
}

// PUT /api/productos/:id: actualiza un producto
async function actualizar(req, res) {
  const errorValidacion = validarProducto(req.body);
  if (errorValidacion) {
    return res.status(400).json({ mensaje: errorValidacion });
  }

  const { id_categoria, nombre_producto, descripcion, sabor, tamano, precio, stock, personalizado, imagen, estado } = req.body;

  try {
    const [resultado] = await pool.query(
      `UPDATE productos
       SET id_categoria = ?, nombre_producto = ?, descripcion = ?, sabor = ?, tamano = ?,
           precio = ?, stock = ?, personalizado = ?, imagen = ?, estado = ?
       WHERE id_producto = ?`,
      [
        id_categoria,
        String(nombre_producto).trim(),
        descripcion || null,
        sabor || null,
        tamano || null,
        Number(precio),
        Number(stock ?? 0),
        personalizado ? 1 : 0,
        imagen || null,
        estado || 'Disponible',
        req.params.id,
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    return res.json({ mensaje: 'Producto actualizado' });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ mensaje: 'La categoria elegida no existe' });
    }
    console.error('Error actualizando producto:', error);
    return res.status(500).json({ mensaje: 'error del servidor al actualizar el producto' });
  }
}

// PATCH /api/productos/:id/estado: activa o desactiva un producto
// No se borra de verdad porque puede estar en pedidos o carritos
async function cambiarEstado(req, res) {
  const { estado } = req.body;

  if (!ESTADOS.includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado no valido' });
  }

  try {
    const [resultado] = await pool.query(
      'UPDATE productos SET estado = ? WHERE id_producto = ?',
      [estado, req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    return res.json({ mensaje: `Producto marcado como ${estado}` });
  } catch (error) {
    console.error('Error cambiando estado:', error);
    return res.status(500).json({ mensaje: 'error del servidor al cambiar el estado' });
  }
}

module.exports = { listar, crear, actualizar, cambiarEstado };