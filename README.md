# Panel de pedidos - WhatsApp Order Bot

Dashboard para gestionar pedidos de restaurante contra el backend en produccion.

## Arrancar

```bash
npm install
npm run dev
```

Abre http://localhost:3000 y pega la API key cuando se te pida.

La clave se guarda solo en memoria. Al recargar la pagina se vuelve a pedir: no hay
localStorage, sessionStorage ni cookies.

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
  pages/       LoginPage, DashboardPage, OrdersPage, MenuPage
  store/       auth, connection, menuOverlay
  types/       order, menu, api
```

Toda la interfaz se construye sobre `src/components/ui`. Los colores por estado salen de un unico
mapa, `src/lib/orderStatus.ts`, y los tokens de color viven en el bloque `@theme` de `src/index.css`.
Para cambiar la linea grafica se tocan esos dos archivos, no los componentes.

## Decisiones tomadas por restricciones del backend

El backend no se modifico. Estas cuatro decisiones responden a comportamientos verificados
contra produccion.

### 1. Proxy de Vite en lugar de llamadas directas

El backend solo permite el origen `http://localhost:3000` y Vite usa 5173 por defecto, asi que
el navegador bloqueaba todas las llamadas. `vite.config.ts` fija el puerto 3000 y ademas define un
proxy de `/api` hacia Railway: el navegador habla con su propio origen y Vite reenvia desde el
servidor, donde CORS no aplica.

Para desplegar en produccion hay que replicar ese proxy en el hosting (rewrites de Vercel o Netlify)
o pedir que agreguen el dominio del panel a `CORS_ORIGINS_LIST` en el backend.

### 2. Una sola consulta de ordenes para toda la app

`/api/orders` tiene un limite de 30 peticiones por minuto. El panel hace UNA consulta
(`limit=100`, sin filtros) que se refresca cada 15 segundos, y reparte las ordenes en las columnas
del kanban en el cliente. El dashboard y el historial comparten la misma entrada de cache de React
Query, asi que entre los dos siguen siendo unas 4 peticiones por minuto. El polling se pausa cuando
la pestana no esta visible.

Si en el futuro se hace una consulta por columna, el limite se agota en segundos.

### 3. Filtros de busqueda y fecha en el cliente

El backend compara `phone_number` con igualdad exacta, asi que una busqueda parcial no devolveria
nada, y no acepta ningun parametro de fecha. Por eso el filtro por telefono es por subcadena y el
rango de fechas se aplica sobre las ordenes ya cargadas.

### 4. Items de menu desactivados

`GET /api/menu` ejecuta `SELECT * FROM menu_items WHERE available = true`, asi que un item
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
