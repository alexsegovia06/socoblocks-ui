# SocoBlocks UI

Frontend de **SocoBlocks**, un marketplace de sets de bloques de construcción para coleccionistas. Está hecho con **React 19 + TypeScript + Vite** y se conecta a un backend en **Spring Boot**.

## Funcionalidades

### Público (invitado)
- Catálogo de sets con filtros, estado de carga y manejo de errores
- Detalle de producto con galería, información, reseñas y sets relacionados
- Registro e inicio de sesión

### Coleccionista
- Inicio con resumen de su actividad
- Carrito con panel lateral, página de carrito y checkout
- Mis pedidos con estado de cada orden
- Perfil, colección, wishlist y configuración de la cuenta

### Vendedor
- Dashboard con estadísticas y alertas de stock
- Gestión de productos con filtros y switch de estatus
- Página de órdenes recibidas

### Administrador
- Dashboard propio
- Gestión de usuarios y cambio de roles
- Aprobación de sets
- Moderación de reseñas

### General
- Modo oscuro con botón para cambiar de tema
- Avisos breves (toasts) en las acciones principales
- Diseño responsive (1024px, 768px, 425px y 320px)
- Rutas protegidas por rol con autenticación JWT

## Tecnologías

| Herramienta | Uso |
|---|---|
| [React 19](https://react.dev/) | Interfaz de usuario |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático |
| [Vite](https://vite.dev/) | Servidor de desarrollo y build |
| [React Router 7](https://reactrouter.com/) | Navegación y rutas protegidas |
| [Lucide React](https://lucide.dev/) | Íconos |
| ESLint | Linter |

## Cómo correr el proyecto

### Requisitos
- Node.js 20 o superior
- El backend de SocoBlocks (Spring Boot) corriendo en `http://localhost:8080`

### Instalación

```bash
git clone https://github.com/alexsegovia06/socoblocks-ui.git
cd socoblocks-ui
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

> Las peticiones a `/api/...` se redirigen automáticamente al backend mediante el proxy configurado en `vite.config.ts`.

### Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila TypeScript y genera el build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Revisa el código con ESLint |

## Roles y rutas

| Rol | Rutas |
|---|---|
| Invitado | `/`, `/products/:id`, `/login`, `/register` |
| Cualquier usuario con sesión | `/cart`, `/checkout` |
| `COLECCIONISTA` | `/user`, `/user/orders`, `/user/profile`, `/user/settings` |
| `VENDEDOR` | `/seller/dashboard`, `/seller/products`, `/seller/orders`, `/seller/settings` |
| `ADMIN` | `/admin/dashboard`, `/admin/users`, `/admin/sets`, `/admin/reviews`, `/admin/settings` |

## Endpoints del backend que se usan

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/login` | Iniciar sesión |
| `POST` | `/api/auth/register` | Registrar usuario |
| `GET` | `/api/user/me` | Datos del usuario autenticado |
| `PUT` | `/api/user/password` | Cambiar contraseña |
| `GET` | `/api/catalogo` | Catálogo de sets |
| `GET` | `/api/admin/users` | Listar usuarios (admin) |
| `PUT` | `/api/admin/users/{username}/role` | Cambiar rol de un usuario (admin) |

## 📁 Estructura

```
src/
├── api.ts            # Wrapper de fetch (JSON, token y errores)
├── App.tsx           # Definición de rutas
├── auth/             # Contexto de sesión, guards por rol y lectura del JWT
├── carrito/          # Contexto y hooks del carrito
├── catalogo/         # Hooks del catálogo y estado de los sets
├── components/       # Componentes reutilizables (cada uno con su .css)
├── pages/            # Páginas públicas y por rol (user, seller, admin)
├── pedidos/          # Lógica de pedidos
├── resenas/          # Moderación de reseñas
├── tema/             # Modo claro / oscuro
├── toast/            # Sistema de avisos
├── wishlist/         # Lista de deseos
└── types.ts          # Tipos compartidos
