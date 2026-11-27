import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Protege las rutas: solo deja pasar si hay sesion activa y el rol esta permitido
export default function ProtectedRoutes({ rolesPermitidos }) {
  const { estaAutenticado, cargando, usuario } = useAuth();

  // Mientras se revisa el localStorage no decidimos nada
  if (cargando) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  // Sin sesion: al login
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  // Con sesion pero sin el rol necesario: tambien al login
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/login" replace />;
  }

  // Todo bien: se muestran las rutas hijas
  return <Outlet />;
}