# pasos para crear el proyecto
- 1 verifique que tenga node.js (node -v)cmd
- 2 Desde la raiz de proyecto crea el proyecto con react y vite
`npm create vite@latest frontend -- -- template react`
- 3 entre a carpeta fronted con `cd frontend` y instale npm `npm install`
- 4 instale la librerias: `npm install bootstrap bootstrap-icons react-router-dom axios`
- 5 empaquetador optimisa y junta todo el css en un solo archivo al hacer `npm run build`
- 6 instalar las dependencias del backend t frontend al tiempo `npm run install:all`
- 7 ingresar la carpeta backend y colocar `npm init -y`


- 8 instalar dependencias
- 8.1 `npm install express mysql2 bcryptjs jsonwebtoken cors dotenv`
- 8.2 crea  .env  dentro de backend para las variables de entorno
- 8.3 crea src/config/db.js  conexion con DB
- 8.4 crea src/middlewares/verificartoken.js valida el token JWT en rutas protegidas 
- 8.5 crea src/controllers/auth.controller.js es la logica de inicio de sesion
- 8.6 crea src/routes/auth.routes.js 
- 8.7 crea src/server.js  arma la app de express
- 8.8 crea en backend seed.js crea el usuario administradora


- 9 crear las siguientes carpetas en frontend
- 9.1 src/api/axiosClient.js
- 9.2 src/api/authService.js
- 9.3 src/context/AuthContext.jsx
- 9.4 src/page/LoginPage.jsx

- 10 construir el esqueleto visual del panel administracion ( sidebar + barra superiror) y proteger las rutas del dashboard para que solo se puedan ver si hay sesion activa 
-10.1 archivos a crear 
-frontend/src/routes/ProtectedRoutes.jsx    -----------------
-fontend/src/layoust/DashboardLayout.jsx
-frontend/src/components/common/Sidebar.jsx
-frontend/src/components/common/topbar.jsx
-frontend/src/pages/DashboardHome.jsx
-frontend/src/pages/NotFoundPage.jsx ------------------------
-editar frontend/src/App.jsx

-11 Crear la pantalla de gestion de ususarios con CRUD y A/D se usan datos simulados en javaScript
-11.1 se crean estos archivos
-frontend/src/data/mockUsuarios.js
-frontend/src/hooks/useCrudSimulado.js
-frontend/src/components/common/EstadoBadge.jxs
-frontend/src/components/common/ConfirmModal.jxs
-frontend/src/components/usuarios/UsuarioFromModal.jxs
-frontend/src/pages/usuariospage.jxs
