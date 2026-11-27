import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/dashboard" className="btn btn-primary">Volver al inicio</Link>
    </div>
  );
}