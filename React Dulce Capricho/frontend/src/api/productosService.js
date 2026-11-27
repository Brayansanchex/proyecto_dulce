import axiosClient from './axiosClient';

// GET /api/productos
export async function listarProductos() {
  const respuesta = await axiosClient.get('/productos');
  return respuesta.data;
}

// POST /api/productos
export async function crearProducto(datos) {
  const respuesta = await axiosClient.post('/productos', datos);
  return respuesta.data;
}

// PUT /api/productos/:id
export async function actualizarProducto(id, datos) {
  const respuesta = await axiosClient.put(`/productos/${id}`, datos);
  return respuesta.data;
}

// PATCH /api/productos/:id/estado
export async function cambiarEstadoProducto(id, estado) {
  const respuesta = await axiosClient.patch(`/productos/${id}/estado`, { estado });
  return respuesta.data;
}