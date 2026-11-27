 import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardHome() {
  const { usuario } = useAuth();

  const accesos = [
    { ruta: '/dashboard/productos', texto: 'Productos', icono: 'bi-cake2' },
    { ruta: '/dashboard/pedidos', texto: 'Pedidos', icono: 'bi-bag-check' },
    { ruta: '/dashboard/ingredientes', texto: 'Ingredientes', icono: 'bi-basket' },
    { ruta: '/dashboard/clientes', texto: 'Clientes', icono: 'bi-people' },
  ];

  return (
    <div>
      <h3 className="mb-1">Bienvenida, {usuario?.nombres} 🧁</h3>
      <p className="text-muted">¿Qué quieres gestionar hoy?</p>
      <div className="row g-3">
        {accesos.map((acceso) => (
          <div className="col-12 col-md-6 col-xl-3" key={acceso.ruta}>
            <Link to={acceso.ruta} className="text-decoration-none">
              <div className="card shadow-sm border-0 text-center p-4 h-100">
                <i className={`bi ${acceso.icono} fs-1 text-danger`}></i>
                <h5 className="mt-2 mb-0 text-dark">{acceso.texto}</h5>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}