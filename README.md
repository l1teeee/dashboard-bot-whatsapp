# Panel de pedidos - WhatsApp Order Bot

Dashboard para gestionar pedidos de restaurante contra el backend en produccion.

## Arrancar

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Si el backend no tiene ninguna cuenta todavia, el login
ofrece el enlace de registro para crear la cuenta inicial.

Rutas principales:

- `/`: redirige a `/dashboard`.
- `/login`: acceso mediante email y contrasena.
- `/register`: registro inicial cuando el backend lo habilita.
- `/accept-invite`: alta de miembros invitados.
- `/dashboard`: operacion de pedidos en vivo.
- `/orders`, `/analytics`, `/menu` y `/settings`: vistas protegidas de operacion y configuracion.

El access token se mantiene solo en memoria. La aplicacion intenta recuperar la
sesion mediante el endpoint de refresh y limpia el estado local al cerrar sesion;
no utiliza localStorage ni sessionStorage para credenciales.

## Stack

React 19, Vite, TypeScript, Tailwind v4, React Query, React Router, Zustand, react-hot-toast.

## Estructura

```
src/
  api/         cliente fetch con envelope + endpoints de ordenes y menu
  components/
    ui/        design system (Button, Card, Badge, Modal, Input, Toggle, ...)
    layout/    Sidebar, Header, AppLayout, RequireAuth, ConnectionBanner
    orders/    kanban, cards, detalle, filtros
    menu/      lista, cards, formulario
  hooks/       useOrders, useOrder, useUpdateOrderStatus, useMenu, useMenuMutations
  lib/         cn, format, orderStatus, queryKeys
  pages/       LoginPage, RegisterPage, AcceptInvitePage, DashboardPage, OrdersPage,
               AnalyticsPage, MenuPage, SettingsPage
  store/       auth, connection, menuOverlay
  types/       order, menu, api
```

Toda la interfaz se construye sobre `src/components/ui`. Los colores por estado salen de un unico
mapa, `src/lib/orderStatus.ts`, y los tokens de color viven en el bloque `@theme` de `src/index.css`.
Para cambiar la linea grafica se tocan esos dos archivos, no los componentes.

## Sesion

El access token (JWT, 15 minutos) vive **solo en memoria**, en el store de zustand. El refresh token
viaja en una cookie `httpOnly` que el navegador gestiona por su cuenta; el codigo nunca la lee. No se
usa localStorage ni sessionStorage para credenciales.

Al cargar la aplicacion, `App.tsx` llama a `POST /api/auth/refresh` para recuperar la sesion. Mientras
esa llamada esta en curso el estado es `loading` y `RequireAuth` muestra el fallback en vez de
redirigir, que es lo que evita el parpadeo hacia el login al recargar.

Cuando una peticion recibe un 401, `src/api/client.ts` dispara **un solo** refresh aunque fallen
varias a la vez (la promesa se comparte en una variable de modulo) y reintenta la original una unica
vez. Si el refresh falla, limpia la sesion.

## Decisiones tomadas por restricciones del backend

### 1. Proxy en lugar de llamadas directas

`vite.config.ts` fija el puerto 3000 y hace proxy de `/api` hacia Railway; en produccion `vercel.json`
replica lo mismo con un rewrite. El navegador siempre habla con su propio origen.

Ademas de resolver CORS, esto es lo que permite que la cookie de sesion use `SameSite=Lax`: al ser
mismo origen no hace falta `SameSite=None`, y el CSRF queda cortado de raiz.

### 2. Una sola consulta de ordenes para toda la app

`/api/orders` esta limitado a 120 peticiones por minuto. El panel hace UNA consulta
(`limit=100`, sin filtros) que se refresca cada 15 segundos, y reparte las ordenes en las columnas
del kanban en el cliente. El dashboard y el historial comparten la misma entrada de cache de React
Query, asi que entre los dos siguen siendo unas 4 peticiones por minuto. El polling se pausa cuando
la pestana no esta visible.

### 3. Filtros de busqueda y fecha en el cliente

El backend compara `phone_number` con igualdad exacta, asi que una busqueda parcial no devolveria
nada, y no acepta ningun parametro de fecha. Por eso el filtro por telefono es por subcadena y el
rango de fechas se aplica sobre las ordenes ya cargadas.

### 4. Items de menu desactivados

`GET /api/menu` solo devuelve los items con `available = true`, asi que un item
desactivado desaparece de la respuesta y no habria forma de reactivarlo desde la interfaz.
`src/store/menuOverlay.ts` recuerda esos items durante la sesion y los sigue mostrando atenuados
para poder volver a activarlos.

Es una solucion de sesion: al recargar la pagina se pierden. La solucion de fondo es que el backend
exponga todos los items, por ejemplo con `GET /api/menu?all=true`.

## Transiciones de estado

El backend las valida y responde 409 si son ilegales. La interfaz solo ofrece las permitidas:

```
pending    -> processing, cancelled
processing -> completed, cancelled
completed  -> terminal
cancelled  -> terminal
```

No se puede volver a `pending`: el endpoint no acepta ese valor.

## Comandos

```bash
npm run dev       # servidor de desarrollo en el puerto 3000
npm run build     # compila a dist/
npm run preview   # sirve dist/ (necesita el proxy o CORS configurado)
npx tsc --noEmit  # verificacion de tipos
```
