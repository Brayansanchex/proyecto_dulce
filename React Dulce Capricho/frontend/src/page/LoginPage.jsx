import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setEnviado(true);

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const mensajeBackend = err?.response?.data?.mensaje;
      setError(mensajeBackend || 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
    } finally {
      setEnviado(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: 400 }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <i className="bi bi-cake2 text-primary" style={{ fontSize: '2.5rem' }}></i>
            <h1 className="h4 mt-2 mb-0">Dulce Capricho</h1>
            <p className="text-muted small">Ingresa con tu cuenta registrada</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={manejarEnvio}>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="admin@dulcecapricho.com" 
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={enviado}>
              {enviado ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}