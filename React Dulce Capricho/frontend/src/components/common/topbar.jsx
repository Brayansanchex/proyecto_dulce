import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

// Barra superior: muestra quien inicio sesion y el boton de salir
export default function Topbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function cerrarSesion() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="d-flex justify-content-between align-items-center px-4 py-3 bg-white shadow-sm">
      <span className="fw-semibold">Panel de administración</span>
      <div className="d-flex align-items-center gap-3">
        <span>
          <i className="bi bi-person-circle me-1"></i>
          {usuario?.nombres} {usuario?.apellidos}
          <small className="text-muted ms-2">({usuario?.rol})</small>
        </span>
        <button className="btn btn-outline-danger btn-sm" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}