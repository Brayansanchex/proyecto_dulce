import { NavLink } from 'react-router-dom';

// Opciones del menu lateral (una por modulo de la base de datos)
const opciones = [
  { ruta: '/dashboard', texto: 'Inicio', icono: 'bi-house' },
  { ruta: '/dashboard/productos', texto: 'Productos', icono: 'bi-cake2' },
  { ruta: '/dashboard/categorias', texto: 'Categorías', icono: 'bi-tags' },
  { ruta: '/dashboard/ingredientes', texto: 'Ingredientes', icono: 'bi-basket' },
  { ruta: '/dashboard/pedidos', texto: 'Pedidos', icono: 'bi-bag-check' },
  { ruta: '/dashboard/clientes', texto: 'Clientes', icono: 'bi-people' },
  { ruta: '/dashboard/usuarios', texto: 'Usuarios', icono: 'bi-person-gear' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <i className="bi bi-cake2 me-2"></i>Dulce Capricho
      </div>
      <nav className="nav flex-column">
        {opciones.map((opcion) => (
          <NavLink
            key={opcion.ruta}
            to={opcion.ruta}
            end={opcion.ruta === '/dashboard'}
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
          >
            <i className={`bi ${opcion.icono} me-2`}></i>
            {opcion.texto}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}