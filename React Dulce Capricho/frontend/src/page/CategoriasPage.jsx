import { useEffect, useState } from 'react';
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  cambiarEstadoCategoria,
} from '../api/categoriasService';

const formularioVacio = {
  nombre_categoria: '',
  descripcion: '',
  estado: 'Activa',
};

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState('');

  // Trae las categorias del backend
  async function cargarDatos() {
    try {
      setError('');
      setCategorias(await listarCategorias());
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudieron cargar las categorías');
    } finally {
      setCargando(false);
    }
  }

  // Al abrir la pagina cargamos los datos una vez
  useEffect(() => {
    cargarDatos();
  }, []);

  function abrirNueva() {
    setEditandoId(null);
    setFormulario(formularioVacio);
    setErrorFormulario('');
    setModalAbierto(true);
  }

  function abrirEditar(categoria) {
    setEditandoId(categoria.id_categoria);
    setFormulario({
      nombre_categoria: categoria.nombre_categoria,
      descripcion: categoria.descripcion || '',
      estado: categoria.estado,
    });
    setErrorFormulario('');
    setModalAbierto(true);
  }

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  }

  async function guardar(evento) {
    evento.preventDefault();
    setErrorFormulario('');
    setGuardando(true);

    try {
      if (editandoId) {
        await actualizarCategoria(editandoId, formulario);
      } else {
        await crearCategoria(formulario);
      }
      setModalAbierto(false);
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(err.response?.data?.mensaje || 'No se pudo guardar la categoría');
    } finally {
      setGuardando(false);
    }
  }

  // Activa o desactiva una categoria (no se borra de la base de datos)
  async function cambiarEstado(categoria) {
    const nuevoEstado = categoria.estado === 'Activa' ? 'Inactiva' : 'Activa';
    const confirmar = window.confirm(
      `¿Marcar la categoría "${categoria.nombre_categoria}" como ${nuevoEstado}?`
    );
    if (!confirmar) return;

    try {
      await cambiarEstadoCategoria(categoria.id_categoria, nuevoEstado);
      await cargarDatos();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo cambiar el estado');
    }
  }

  // Filtro de busqueda por nombre o descripcion
  const texto = busqueda.toLowerCase();
  const categoriasFiltradas = categorias.filter(
    (c) =>
      c.nombre_categoria.toLowerCase().includes(texto) ||
      (c.descripcion || '').toLowerCase().includes(texto)
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 className="mb-0">Categorías</h3>
        <button className="btn btn-primary" onClick={abrirNueva}>
          <i className="bi bi-plus-lg me-1"></i>Nueva categoría
        </button>
      </div>

      <input
        type="search"
        className="form-control mb-3"
        placeholder="Buscar por nombre o descripción..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Categoría</th>
                <th>Descripción</th>
                <th className="text-center">Productos</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando && (
                <tr>
                  <td colSpan="5" className="text-center py-4">Cargando...</td>
                </tr>
              )}

              {!cargando && categoriasFiltradas.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No hay categorías para mostrar
                  </td>
                </tr>
              )}

              {categoriasFiltradas.map((c) => (
                <tr key={c.id_categoria}>
                  <td><strong>{c.nombre_categoria}</strong></td>
                  <td>{c.descripcion || '-'}</td>
                  <td className="text-center">
                    <span className="badge bg-light text-dark">{c.total_productos}</span>
                  </td>
                  <td>
                    <span className={`badge ${c.estado === 'Activa' ? 'bg-success' : 'bg-secondary'}`}>
                      {c.estado}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-outline-primary btn-sm me-1"
                      onClick={() => abrirEditar(c)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className={`btn btn-sm ${c.estado === 'Activa' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => cambiarEstado(c)}
                      title={c.estado === 'Activa' ? 'Desactivar' : 'Activar'}
                    >
                      <i className={`bi ${c.estado === 'Activa' ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ventana con el formulario de crear / editar */}
      {modalAbierto && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={guardar}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editandoId ? 'Editar categoría' : 'Nueva categoría'}
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setModalAbierto(false)}></button>
                  </div>

                  <div className="modal-body">
                    {errorFormulario && (
                      <div className="alert alert-danger py-2">{errorFormulario}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Nombre *</label>
                      <input
                        name="nombre_categoria"
                        className="form-control"
                        maxLength="100"
                        value={formulario.nombre_categoria}
                        onChange={manejarCambio}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea
                        name="descripcion"
                        rows="2"
                        maxLength="200"
                        className="form-control"
                        value={formulario.descripcion}
                        onChange={manejarCambio}
                      ></textarea>
                    </div>

                    <div className="mb-1">
                      <label className="form-label">Estado</label>
                      <select
                        name="estado"
                        className="form-select"
                        value={formulario.estado}
                        onChange={manejarCambio}
                      >
                        <option value="Activa">Activa</option>
                        <option value="Inactiva">Inactiva</option>
                      </select>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setModalAbierto(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={guardando}>
                      {guardando ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  );
}