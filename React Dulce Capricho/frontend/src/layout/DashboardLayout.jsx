import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar.jsx';
import Topbar from '../components/common/topbar.jsx';

// Esqueleto del panel: sidebar a la izquierda, barra superior y contenido
export default function DashboardLayout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 min-vh-100 d-flex flex-column">
        <Topbar />
        <main className="p-4 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}