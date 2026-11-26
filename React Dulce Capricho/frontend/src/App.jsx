import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './page/LoginPage.jsx'
import { useAuth } from './context/AuthContext.jsx'

// Pagina temporal para comprobar que el login funciona
function DashboardTemporal() {
  const { usuario, logout } = useAuth()
  return (
    <div className="container mt-5 text-center">
      <h2>Bienvenida, {usuario?.nombres} 🧁</h2>
      <p>
        Rol: <strong>{usuario?.rol}</strong>
      </p>
      <button className="btn btn-outline-danger" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardTemporal />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}