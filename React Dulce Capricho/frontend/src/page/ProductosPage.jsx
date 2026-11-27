import { useEffect, useState } from 'react';
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  cambiarEstadoProducto,
} from '../api/productosService';
import { listarCategorias } from '../api/categoriasService';

// Formato de pesos colombianos: $60.000
const formatoPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const formularioVacio = {
  nombre_producto: '',
  id_categoria: '',
  descripcion: '',
  sabor: '',
  tamano: '',
  precio: '',
  stock: 0,
  personalizado: false,
  imagen: '',
  estado: 'Disponible',
};

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState('');

  // Trae productos y categorias del backend
  async function cargarDatos() {
    try {
      setError('');
      const [listaProductos, listaCategorias] = await Promise.all([
        listarProductos(),
        listarCategorias(),
      ]);
      setProductos(listaProductos);
      setCategorias(listaCategorias);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudieron cargar los productos');
    } finally {
      setCargando(false);
    }
  }

  // Al abrir la pagina cargamos los datos una vez
  useEffect(() => {
    cargarDatos();
  }, []);

  function abrirNuevo() {
    setEditandoId(null);
    setFormulario(formularioVacio);
    setErrorFormulario('');
    setModalAbierto(true);
  }

  function abrirEditar(producto) {
    setEditandoId(producto.id_producto);
    setFormulario({
      nombre_producto: producto.nombre_producto,
      id_categoria: producto.id_categoria,
      descripcion: producto.descripcion || '',
      sabor: producto.sabor || '',
      tamano: producto.tamano || '',
      precio: producto.precio,
      stock: producto.stock,
      personalizado: Boolean(producto.personalizado),
      imagen: producto.imagen || '',
      estado: producto.estado,
    });
    setErrorFormulario('');
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
  }

  // Actualiza el campo del formulario que cambio
  function manejarCambio(evento) {
    const { name, value, type, checked } = evento.target;
    setFormulario((anterior) => ({
      ...anterior,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function guardar(evento) {
    evento.preventDefault();
    setErrorFormulario('');
    setGuardando(true);

    const datos = {
      ...formulario,
      id_categoria: Number(formulario.id_categoria),
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
    };

    try {
      if (editandoId) {
        await actualizarProducto(editandoId, datos);
      } else {
        await crearProducto(datos);
      }
      setModalAbierto(false);
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(err.response?.data?.mensaje || 'No se pudo guardar el producto');
    } finally {
      setGuardando(false);
    }
  }

  // Activa o desactiva un producto (no se borra de la base de datos)
  async function cambiarEstado(producto) {
    const nuevoEstado = producto.estado === 'Disponible' ? 'No disponible' : 'Disponible';
    const confirmar = window.confirm(
      `¿Marcar "${producto.nombre_producto}" como ${nuevoEstado}?`
    );
    if (!confirmar) return;

    try {
      await cambiarEstadoProducto(producto.id_producto, nuevoEstado);
      await cargarDatos();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo cambiar el estado');
    }
  }

  // Filtro de busqueda por nombre o categoria
  const texto = busqueda.toLowerCase();
  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre_producto.toLowerCase().includes(texto) ||
      p.nombre_categoria.toLowerCase().includes(texto)
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 className="mb-0">Productos</h3>
        <button className="btn btn-primary" onClick={abrirNuevo}>
          <i className="bi bi-plus-lg me-1"></i>Nuevo producto
        </button>
      </div>

      <input
        type="search"
        className="form-control mb-3"
        placeholder="Buscar por nombre o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Sabor</th>
                <th>Tamaño</th>
                <th className="text-end">Precio</th>
                <th className="text-center">Stock</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando && (
                <tr>
                  <td colSpan="8" className="text-center py-4">Cargando...</td>
                </tr>
              )}

              {!cargando && productosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No hay productos para mostrar
                  </td>
                </tr>
              )}

              {productosFiltrados.map((p) => (
                <tr key={p.id_producto}>
                  <td>
                    <strong>{p.nombre_producto}</strong>
                    {p.personalizado ? (
                      <span className="badge bg-info text-dark ms-2">Personalizable</span>
                    ) : null}
                  </td>
                  <td>{p.nombre_categoria}</td>
                  <td>{p.sabor || '-'}</td>
                  <td>{p.tamano === 'Pequeno' ? 'Pequeño' : p.tamano || '-'}</td>
                  <td className="text-end">{formatoPesos.format(p.precio)}</td>
                  <td className="text-center">
                    <span className={`badge ${p.stock <= 3 ? 'bg-warning text-dark' : 'bg-light text-dark'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.estado === 'Disponible' ? 'bg-success' : 'bg-secondary'}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-outline-primary btn-sm me-1"
                      onClick={() => abrirEditar(p)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className={`btn btn-sm ${p.estado === 'Disponible' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => cambiarEstado(p)}
                      title={p.estado === 'Disponible' ? 'Desactivar' : 'Activar'}
                    >
                      <i className={`bi ${p.estado === 'Disponible' ? 'bi-eye-slash' : 'bi-eye'}`}></i>
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
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
              <div className="modal-content">
                <form onSubmit={guardar}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editandoId ? 'Editar producto' : 'Nuevo producto'}
                    </h5>
                    <button type="button" className="btn-close" onClick={cerrarModal}></button>
                  </div>

                  <div className="modal-body">
                    {errorFormulario && (
                      <div className="alert alert-danger py-2">{errorFormulario}</div>
                    )}

                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label">Nombre *</label>
                        <input
                          name="nombre_producto"
                          className="form-control"
                          value={formulario.nombre_producto}
                          onChange={manejarCambio}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Categoría *</label>
                        <select
                          name="id_categoria"
                          className="form-select"
                          value={formulario.id_categoria}
                          onChange={manejarCambio}
                          required
                        >
                          <option value="">Selecciona...</option>
                          {categorias
                            .filter(
                              (c) =>
                                c.estado === 'Activa' ||
                                c.id_categoria === Number(formulario.id_categoria)
                            )
                            .map((c) => (
                              <option key={c.id_categoria} value={c.id_categoria}>
                                {c.nombre_categoria}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Sabor</label>
                        <input
                          name="sabor"
                          className="form-control"
                          value={formulario.sabor}
                          onChange={manejarCambio}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Tamaño</label>
                        <select
                          name="tamano"
                          className="form-select"
                          value={formulario.tamano}
                          onChange={manejarCambio}
                        >
                          <option value="">Sin tamaño</option>
                          <option value="Pequeno">Pequeño</option>
                          <option value="Mediano">Mediano</option>
                          <option value="Grande">Grande</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Estado</label>
                        <select
                          name="estado"
                          className="form-select"
                          value={formulario.estado}
                          onChange={manejarCambio}
                        >
                          <option value="Disponible">Disponible</option>
                          <option value="No disponible">No disponible</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Precio (COP) *</label>
                        <input
                          name="precio"
                          type="number"
                          min="0"
                          step="100"
                          className="form-control"
                          value={formulario.precio}
                          onChange={manejarCambio}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Stock</label>
                        <input
                          name="stock"
                          type="number"
                          min="0"
                          step="1"
                          className="form-control"
                          value={formulario.stock}
                          onChange={manejarCambio}
                        />
                      </div>

                      <div className="col-md-4 d-flex align-items-end">
                        <div className="form-check mb-2">
                          <input
                            id="personalizado"
                            name="personalizado"
                            type="checkbox"
                            className="form-check-input"
                            checked={formulario.personalizado}
                            onChange={manejarCambio}
                          />
                          <label className="form-check-label" htmlFor="personalizado">
                            Se puede personalizar
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Descripción</label>
                        <textarea
                          name="descripcion"
                          rows="2"
                          className="form-control"
                          value={formulario.descripcion}
                          onChange={manejarCambio}
                        ></textarea>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Imagen (nombre de archivo o URL)</label>
                        <input
                          name="imagen"
                          className="form-control"
                          value={formulario.imagen}
                          onChange={manejarCambio}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={cerrarModal}>
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