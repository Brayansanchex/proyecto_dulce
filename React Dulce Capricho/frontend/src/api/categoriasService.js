import axiosClient from './axiosClient';

// GET /api/categorias
export async function listarCategorias() {
  const respuesta = await axiosClient.get('/categorias');
  return respuesta.data;
}

// POST /api/categorias
export async function crearCategoria(datos) {
  const respuesta = await axiosClient.post('/categorias', datos);
  return respuesta.data;
}

// PUT /api/categorias/:id
export async function actualizarCategoria(id, datos) {
  const respuesta = await axiosClient.put(`/categorias/${id}`, datos);
  return respuesta.data;
}

// PATCH /api/categorias/:id/estado
export async function cambiarEstadoCategoria(id, estado) {
  const respuesta = await axiosClient.patch(`/categorias/${id}/estado`, { estado });
  return respuesta.data;
}