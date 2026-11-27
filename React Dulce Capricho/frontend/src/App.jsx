import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './page/LoginPage.jsx';
import ProtectedRoutes from './routes/ProtectedRoutes.jsx';
import DashboardLayout from './layout/DashboardLayout.jsx';
import DashboardHome from './page/DashboardHome.jsx';
import NotFoundPage from './page/NotFoundPage.jsx';
import EnConstruccion from './page/EnConstruccion.jsx';
import ProductosPage from './page/ProductosPage.jsx';
import CategoriasPage from './page/CategoriasPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Todo lo que esta aqui dentro exige sesion de Administrador */}
      <Route element={<ProtectedRoutes rolesPermitidos={['Administrador']} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="ingredientes" element={<EnConstruccion titulo="Ingredientes" />} />
          <Route path="pedidos" element={<EnConstruccion titulo="Pedidos" />} />
          <Route path="clientes" element={<EnConstruccion titulo="Clientes" />} />
          <Route path="usuarios" element={<EnConstruccion titulo="Usuarios" />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  ); 
}