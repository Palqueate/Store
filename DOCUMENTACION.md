# Palqueate — Documentación funcional y técnica

> Documento integral del funcionamiento de la aplicación, sus requerimientos,
> arquitectura, dominio, flujos de usuario y guía de operación.
> Fecha del documento: 2026-06-29.

---

## 1. ¿Qué es Palqueate?

**Palqueate** es un **marketplace de dos lados** para **alquilar palcos** (boxes
privados) en estadios de fútbol uruguayos. Conecta a tres tipos de actor:

- **Cliente / hincha** — navega eventos y palcos, elige asientos y reserva.
- **Palquista / dueño** — publica y gestiona sus palcos, ve estadísticas y cobra.
- **Administrador** — carga eventos, gestiona estadios, verifica palcos y opera
  el panel de CRM + finanzas.

Un palco puede alquilarse en **tres modalidades**:

| Modalidad | Clave interna | Qué incluye | Término |
|-----------|---------------|-------------|---------|
| **Palco entero** | `palcoYear` | Todos los asientos del palco, por 1 año | Temporada (anual) |
| **Asiento anual** | `seatYear` | Una butaca durante toda la temporada | Temporada (anual) |
| **Asiento por evento** | `seatEvent` | Una butaca para un evento puntual (una función) | Por evento |

La aplicación es una **recreación fiel en React** de un prototipo originalmente
diseñado en Claude Design. Todo el estado, los pagos y los datos son
**del lado del cliente y simulados**; las cuentas y reservas persisten en
`localStorage`. No hay backend real (aún): la arquitectura está preparada para
enchufar uno cambiando una sola línea (ver §11).

---

## 2. Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Lenguaje | TypeScript 5.6 (modo `strict`, con `noImplicitAny: false`) |
| UI | React 18.3 |
| Build / dev server | Vite 5.4 (`@vitejs/plugin-react`) |
| Routing | `react-router-dom` 7 (`BrowserRouter`) |
| Estado global | **Zustand** 5 (store compuesto por *slices*) |
| Iconos | `@heroicons/react` (solo en el *showcase* de componentes) |
| Estilos | CSS plano con *design tokens* (variables CSS) + estilos inline parseados |
| Persistencia | `localStorage` del navegador |
| Fuentes | Archivo + Space Mono (Google Fonts CDN) |
| Gestor de paquetes | pnpm (hay `pnpm-lock.yaml` y `pnpm-workspace.yaml`) — el README usa `npm` indistintamente |

No hay tests automatizados ni linter configurado en `package.json`. La
verificación de calidad es `tsc --noEmit` (type-check) integrado en el build.

---

## 3. Requerimientos

### 3.1 Requerimientos de entorno (para correr el proyecto)

- **Node.js** moderno (el proyecto declara `@types/node` ^26; cualquier LTS
  reciente compatible con Vite 5 sirve).
- **pnpm** (recomendado, hay lockfile) o **npm**.
- Navegador moderno con soporte de:
  - `localStorage`
  - `FileReader` / `canvas` (para redimensionar la foto de perfil y leer imágenes)
  - `conic-gradient` y `color-mix()` en CSS (gráficos de finanzas/estadísticas)
- **Acceso a internet** para cargar las fuentes desde el CDN de Google Fonts
  (lo demás funciona offline).

### 3.2 Scripts disponibles

```bash
npm install        # o pnpm install
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run build      # type-check (tsc --noEmit) + build de producción a dist/
npm run preview    # sirve el build de producción
npm run typecheck  # solo type-check
```

### 3.3 Requerimientos funcionales (qué debe hacer el sistema)

**Cliente**
- Explorar eventos (agenda) y palcos (catálogo) con filtros y orden.
- Ver el detalle de un palco con mapa del estadio, modalidades y grilla de asientos.
- Seleccionar asientos disponibles (no los ya tomados) según modalidad y función.
- Agregar reservas al carrito, ver subtotal + comisión (4 %) y pagar.
- Recibir confirmación con código de reserva y QR.
- Pedir botana y bebidas asociadas a una reserva.
- Registrarse / iniciar sesión; gestionar cuenta, foto, preferencias e historial.

**Palquista (dueño)**
- Publicar un palco mediante un asistente de 10 pasos (país → … → precios).
- Editar palcos (cualquier cambio los reenvía a verificación).
- Pausar / reactivar publicaciones.
- Ver estadísticas (recaudación, ocupación, conversión, tendencias).
- Responder a campos rechazados por el admin y reenviar a revisión.

**Administrador**
- Dashboard con KPIs (GMV, comisión, payout, botana, ocupación, etc.).
- Crear / editar **eventos** (con una o varias funciones fecha+hora).
- Crear / editar **estadios** (con plano/foto opcional).
- Listar palcos y **verificarlos** (aprobar / rechazar campo por campo).
- CRM de clientes (gasto, puntos, historial de reservas).
- Listado de reservas y panel de finanzas.

**Transversales**
- Dos temas visuales (oscuro/claro) conmutables.
- Diseño responsive: barra inferior fija en pantallas < 860px.
- Persistencia local de cuentas, sesión, órdenes y altas de admin.

### 3.4 Reglas de negocio clave

- **Comisión de la plataforma: 4 %** sobre el subtotal de cada reserva
  (`fee = round(subtotal * 0.04)`), tanto en el cobro al cliente como en los KPIs.
- **Visibilidad del catálogo**: solo los palcos en estado `publicado` o
  `alquilado` aparecen al público. Los `pendiente`, `rechazado` y `pausado`
  quedan fuera.
- **Verificación obligatoria**: todo palco nuevo o editado entra como
  `pendiente` y necesita aprobación del admin antes de publicarse.
- **No se puede pausar un palco `alquilado`**.
- **Disponibilidad de asientos** es por modalidad:
  - `seatYear`: lista de asientos tomados a nivel temporada.
  - `seatEvent`: asientos tomados indexados por **función** (fecha+hora), no por evento.
- **Moneda**: pesos uruguayos, formato `"$U 1.180.000"` (`es-UY`).

---

## 4. Arquitectura general

El proyecto sigue una **arquitectura modular / hexagonal (puertos y adaptadores)**
con una clara separación entre dominio, aplicación, infraestructura y UI.

```
src/
├─ main.tsx                  Punto de entrada: monta App o el Showcase (#showcase)
├─ App.tsx                   Raíz: tema, header, tabla de rutas, overlays
│
├─ app/                      "Composition root" + estado + routing
│  ├─ container.ts           Inyección de dependencias (memory ↔ http)
│  ├─ router/                navigation.ts (mapa rutas↔screen) + RouterBridge.tsx
│  └─ store/                 Store Zustand compuesto por slices
│     ├─ index.ts            useAppStore + useBootstrap()
│     ├─ useAppStore.ts      create() combinando los 8 slices
│     └─ slices/             ui · filters · catalog · navigation · cart · auth · admin · owner
│
├─ modules/                  Un módulo por dominio (Screaming Architecture)
│  ├─ accounts/  events/  food/  home/  orders/  owner/  palcos/  stadiums/  admin/
│  │   ├─ domain/            Tipos + lógica pura de dominio
│  │   ├─ application/       ports/ (interfaces) + use-cases/
│  │   ├─ infrastructure/    InMemory*Repository + Http*Repository
│  │   └─ ui/                Pantalla (.tsx) + view-model (useXxxVM.ts)
│
├─ shared/                   Código transversal
│  ├─ domain/                money · theme · countries
│  ├─ application/ports/     HttpClient
│  ├─ infrastructure/        http/FetchHttpClient · in-memory/db.ts (seed) · storage/localStorage
│  ├─ lib/                   promoPosters · readImages
│  └─ ui/                    components/ (Btn, Header, SeatGrid, StadiumMap…) + vm/ (facade, helpers)
│
├─ lib/                      Sistema de componentes de diseño + sitio de docs (Showcase)
└─ styles/                   styles.css → tokens/*.css + global.css
```

### 4.1 Capas (de adentro hacia afuera)

1. **Domain** (`modules/*/domain`, `shared/domain`) — tipos e invariantes puras,
   sin dependencias de framework. Ej.: `Palco`, `Ev`, `User`, `Order`,
   `eventOccurrences()`, `formatMoney()`.
2. **Application** (`modules/*/application`) — **puertos** (interfaces de
   repositorio) y **casos de uso** (funciones que orquestan un puerto). Ej.:
   `publishPalco(repo, palco)`, `createEvent(repo, ev)`.
3. **Infrastructure** (`modules/*/infrastructure`) — **adaptadores** que
   implementan los puertos: `InMemory*Repository` (sobre `localStorage` + el
   seed mutable) y `Http*Repository` (sobre `FetchHttpClient`).
4. **UI** (`modules/*/ui`, `shared/ui`, `App.tsx`) — componentes React +
   *view-models* por pantalla que consumen el store.

La regla de dependencia apunta siempre hacia adentro: la UI depende de casos de
uso y del store; los casos de uso dependen de puertos; los adaptadores
implementan puertos. **Ningún consumidor conoce el adaptador concreto.**

---

## 5. Estado global (Zustand) y *view-models*

### 5.1 El store y sus *slices*

`useAppStore` (`src/app/store/useAppStore.ts`) se construye combinando **8
slices**, todos compartiendo el mismo `(set, get)` para poder llamarse entre sí:

| Slice | Responsabilidad |
|-------|-----------------|
| `uiSlice` | tema, viewport (`vw`), toast, menú de cuenta, `money()`, `flash()` |
| `filtersSlice` | estado de filtros de palcos, eventos y métricas (solo estado) |
| `catalogSlice` | colecciones cargadas (`stadiums`, `events`, `palcos`, `foodCatalog`…) y **selectores derivados** (`filtered`, `priceBounds`, `fromPrice`, `cardVM`, etc.) + `bootstrap()` |
| `navigationSlice` | `screen` espejo, selección de palco (`pId`, `mode`, `eventId`, `occurrenceId`, `seats`), `go()`, `detailVM()` |
| `cartSlice` | carrito, pedido de botana, `pay()`, selectores de carrito/comida |
| `authSlice` | usuario logueado, cuentas, login/registro, edición de perfil y foto |
| `adminSlice` | pestaña de admin, drafts de evento/estadio, verificación de palcos |
| `ownerSlice` | asistente de publicación (`wz`), edición, reenvío a revisión |

### 5.2 Arranque (`bootstrap`)

`useBootstrap()` (efecto en `App`) llama a `bootstrap()`, que carga **todo en
paralelo** vía casos de uso (`Promise.all` sobre estadios, eventos, palcos,
catálogo de comida, cuentas, órdenes y sesión), reconstruye el usuario a partir
del `sessionId` guardado y publica todo en el store. También engancha un
listener de `resize` para mantener `vw` (responsive).

### 5.3 Patrón *view-model*

Cada pantalla tiene un hook `useXxxVM()` (en `modules/*/ui/` o `shared/ui/vm/`)
que lee el store mediante un **facade** (`useFacade`) y produce un objeto plano
listo para renderizar (textos formateados, estilos inline, callbacks). Así la
lógica vive fuera del JSX y las pantallas quedan declarativas. El facade expone
`state` + todas las acciones/selectores del store.

---

## 6. Modelo de dominio

### 6.1 `Stadium` (estadio)

```ts
{ id, name, short, city, country?, shape, capacity?, year?, surface?,
  levels?, address?, roof?, mapImage? }
```
`mapImage` (data URL) permite usar un plano/foto real como fondo del mapa en
lugar del campo estilizado.

### 6.2 `Ev` (evento) y `EventOccurrence` (función)

Un evento puede tener **varias funciones** (`dates: EventOccurrence[]`), cada una
con fecha+hora propias. El fútbol suele tener una; los shows, varias. Los campos
"principales" (`month/day/dow/time/iso`) reflejan la **primera** función por
compatibilidad.

- `eventOccurrences(ev)` → devuelve las funciones (o deriva una desde los campos
  principales si no hay `dates`).
- `eventOccurrence(ev, id)` → una función concreta (o la primera).

Para eventos de **fecha única**, el id de la función **coincide** con el id del
evento, de modo que la disponibilidad de asientos por evento (`seatEvent.taken`)
queda indexada por ese mismo id.

### 6.3 `Palco`

```ts
{ id, stadium, country?, title, sector, map:{x,y}, seats, parking:{has,n},
  amenities?, coOwners?, payout?, host, rating, photos, images,
  modes: { palcoYear:{on,price}, seatYear:{on,price,taken[]},
           seatEvent:{on,price,taken:{[occId]:number[]}} },
  status, review? }
```

**Estados del palco** (`PalcoStatus`):

| Estado | Significado |
|--------|-------------|
| `pendiente` | Registrado, esperando verificación del admin |
| `rechazado` | El admin lo rechazó; el palquista debe corregir los campos marcados |
| `publicado` | Aprobado y disponible para alquilar |
| `pausado` | El dueño lo pausó (oculto del catálogo) |
| `alquilado` | Con reservas activas (no se puede pausar) |

**Verificación** (`PalcoReview` + `PalcoFieldFlag`): el admin puede marcar
campos concretos como no validados, cada uno con su motivo; el palquista puede
responder (`ownerReply`) y reenviar. El catálogo de campos revisables
(`PALCO_REVIEW_FIELDS`) cubre país, estadio, ubicación, asientos,
estacionamiento, comodidades, fotos, co-propietarios y los datos de cobro
(banco, SWIFT, beneficiario, cuenta, sucursal, documentos de identidad,
comprobante de domicilio y título de propiedad).

**Cobro** (`PalcoPayout`): país de la cuenta, SWIFT/BIC, banco, beneficiario,
número de cuenta, sucursal y 4 documentos (anverso/reverso de identidad,
comprobante de domicilio, título de propiedad) como data URLs.

### 6.4 `User`

```ts
{ id, name, email, phone?, pass?, joined?, ci?, birth?, city?, address?,
  country?, favStadium?, lang?, verified?, points?, admin?, photo?,
  notif?:{email,sms,push,promos}, card?:{brand,last4,exp,name},
  billing?:{name,rut} }
```
`admin: true` habilita el panel de administración.

### 6.5 `Order` y `OrderItem`

```ts
Order  = { code, userId, subtotal, fee, total, date, contact:{name,email},
           food:[{id,name,qty,price}], foodTotal, items: OrderItem[] }
OrderItem = { uid, palcoId, palcoTitle, stadium, mode, modeLabel, seats[],
              term, qty, price, eventId?, occurrenceId?, eventLabel?, eventOpp? }
```

### 6.6 `Food`

Catálogo plano de items (`FoodItem`) con categoría, nombre, precio y descripción,
agrupados por categorías (`FoodCat`): para compartir, sándwiches, pizzas,
cervezas, bebidas y dulce.

---

## 7. Datos semilla (seed)

El "origen de verdad" en memoria está en `src/shared/infrastructure/in-memory/db.ts`,
con colecciones **mutables** (los adaptadores in-memory hacen `push` sobre ellas):

- **2 estadios**: Gran Parque Central (GPC) y Campeón del Siglo (CDS).
- **7 eventos**: 5 de fútbol (fecha única) y 2 shows con múltiples funciones
  (Banda Aurora x3 funciones, Ghost x2 funciones). Se construyen con `buildEvent`,
  que replica exactamente la forma que produce el alta del admin.
- **3 tipos de evento**: Fútbol, Basketball, Show.
- **6 palcos** (`p1`–`p6`) repartidos entre ambos estadios, con distintas
  modalidades activas, precios, asientos tomados y estados (`p6` arranca `pausado`).
- **14 items de botana** en 6 categorías.
- **1 cuenta demo**: **María Eugenia** (`u_maru`, email
  `maria.eugenia@palqueate.uy`, pass `palqueate`), que es **admin** y tiene
  tarjeta, puntos (1840) y preferencias precargadas.
- **2 órdenes semilla** asociadas a esa cuenta (una con botana).

---

## 8. Routing y pantallas

`App.tsx` define la tabla de rutas con `react-router-dom`. La **URL es la fuente
de verdad** de qué pantalla se renderiza; el store mantiene un `screen` espejo
(seteado por `RouterBridge`) solo para la lógica de estados activos del
view-model. Las acciones del store navegan vía `routerNavigate()`
(referencia ligada por `RouterBridge`, porque las acciones Zustand viven fuera
de React y no pueden usar hooks).

| Ruta | Pantalla | Descripción |
|------|----------|-------------|
| `/` | `Home` | Portada: accesos a eventos y temporada |
| `/palcos` | `Results` | Catálogo de palcos con filtros y orden |
| `/eventos` | `Events` | Agenda de eventos con filtros |
| `/evento/:eventId` | `EventPalcos` | Palcos disponibles para un evento/función |
| `/palco/:palcoId` | `Detail` | Detalle del palco: mapa, modalidades, asientos |
| `/carrito` | `Cart` | Carrito de reservas |
| `/checkout` | `Checkout` | Datos de contacto / pago |
| `/confirmacion` | `Confirm` | Confirmación con código + QR |
| `/comida` | `Food` | Menú de botana y bebidas |
| `/comida/confirmacion` | `FoodConfirm` | "Pedido listo" |
| `/owner` | `Owner` | "Mis palcos" (pausar/reactivar) |
| `/owner/metricas` | `Metrics` | Estadísticas del palquista |
| `/publicar` | `Publish` | Asistente de publicación (10 pasos) |
| `/cuenta` | `Account` | Mi cuenta (perfil, foto, preferencias, compras) |
| `/admin` | `Admin` | Panel de administración |
| `*` | `Home` | Fallback |

**Overlays globales** (montados siempre, controlados por estado): barra inferior
de navegación (`BottomNav`, en móvil), backdrop de cuenta, modal de auth, modal
de evento, modal de estadio, modal de revisión de palco y el toast.

**Showcase**: visitando `/#showcase` (o `/#showcase/<componente>`) se carga, con
*code-splitting*, un sitio de documentación del sistema de componentes (carpeta
`src/lib/`). Cruzar la frontera app↔showcase recarga la página; navegar dentro
de los docs no.

---

## 9. Flujos de usuario detallados

### 9.1 Cliente — reserva *event-first*

```
Home → "Ver próximos eventos" → elegir evento (y función si tiene varias)
     → elegir palco con disponibilidad → elegir asientos
     → carrito → checkout → pagar → confirmación (código + QR)
     → menú de botana & bebidas → "pedido listo"
```

### 9.2 Cliente — reserva por temporada

```
Home → "Alquilar por temporada" → detalle del palco con las 3 modalidades
     (palco entero / asiento anual / asiento por evento) y el mapa interactivo
     del estadio → seleccionar → carrito → checkout → pago.
```

**Selección de asientos** (`detailVM` + `toggleSeat`): la grilla muestra cada
butaca como `free`, `sel` (seleccionada), `taken` (tomada, no clickeable) o
`all` (cuando la modalidad es palco entero, no se elige asiento). El conjunto de
tomados depende de la modalidad y, para `seatEvent`, de la **función** elegida.

**Agregar al carrito** (`addToCart`): construye un `OrderItem` según la
modalidad, validando que haya al menos un asiento elegido en las modalidades por
asiento. Calcula `price` (precio × cantidad) y navega al carrito.

**Pago** (`pay`): si no hay usuario, abre el modal de login y marca `pendingPay`
(al loguearse, se reanuda el pago automáticamente). Si hay carrito, simula el
cobro con un `setTimeout` de 1300 ms; genera un código `PLQ-XXXX`, arma la orden
(subtotal + `fee` 4 % + total), la persiste y navega a confirmación.

**Botana** (`addFood`/`decFood`/`confirmFood`): el pedido de comida se asocia a
la reserva activa (`activeRes`), actualizando la orden con `food` y `foodTotal`.

### 9.3 Palquista — publicar palco (asistente de 10 pasos)

`ownerSlice` maneja el asistente `wz`. Pasos (índice 0–9):

| Paso | Contenido | Validación al avanzar |
|------|-----------|------------------------|
| 0 | País | Debe haber/elegirse un estadio en ese país |
| 1 | Estadio | Estadio requerido |
| 2 | Ubicación (pin en el plano) | `x` no nulo (tocar el plano) |
| 3 | Asientos | ≥ 1 asiento |
| 4 | Estacionamiento | — |
| 5 | Comodidades | ≥ 1 comodidad |
| 6 | Fotos | ≥ 3 fotos (`MIN_PHOTOS`) |
| 7 | Co-propietarios | Cada uno con nombre y email válido |
| 8 | Cobro (datos bancarios + 4 documentos) | Banco, beneficiario, cuenta, sucursal y los 4 documentos requeridos |
| 9 | **Precios** (paso final) | ≥ 1 modalidad activa → **publica** |

Comodidades sugeridas (`DEFAULT_AMENITIES`): Wi-Fi, Cocina, Heladera, Televisión,
Baño, Aire acondicionado, Calefacción, Bar, Parrillero (el palquista puede sumar
las suyas). Las imágenes y documentos se guardan como **data URLs** (leídas con
`readImagesAsDataUrls`).

Al publicar, el palco entra como **`pendiente`** (a verificación). Si es una
**edición** (`editId`), se preservan identidad, reputación y asientos ya
alquilados, pero **vuelve a `pendiente`** y sale del catálogo hasta nueva
aprobación.

### 9.4 Palquista — gestión y métricas

- **Mis palcos** (`Owner`): pausar/reactivar (`togglePublish`). No se puede
  pausar un `alquilado`.
- **Estadísticas** (`Metrics` / `useMetricsVM`): solo palcos cuyo `host` es
  `"Vos (demo)"`. KPIs: recaudación, ocupación anual, entradas por evento,
  vistas (30 días) + conversión. Gráficos de ingresos por modalidad, ventas por
  evento, tendencia mensual y tabla por palco. Las vistas/favoritos/tendencias
  son **derivadas determinísticamente** de un hash del id (datos de demo
  estables, no aleatorios).
- **Respuesta a rechazos** (`setPalcoFieldReply`, `resubmitPalco`): el palquista
  aclara campos marcados y reenvía el palco rechazado a `pendiente`.

### 9.5 Autenticación y cuenta

- **Ingresar** (`doLogin`): demo — siempre entra a la cuenta María Eugenia
  (el formulario se prellenará con sus credenciales).
- **Registrarse** (`doRegister`): valida nombre (≥2), email (regex) y contraseña
  (≥4), y que el email no exista. Crea la cuenta, abre sesión y, si había un
  pago pendiente, lo reanuda.
- **Mi cuenta** (`Account`): perfil editable (con validaciones), **foto de
  perfil** (se redimensiona a 256px máx vía canvas y se guarda como JPEG data
  URL), preferencias de notificaciones, estadio favorito, idioma, e **historial
  de compras** (`myOrders`).
- **Sesión**: el id del usuario se guarda en `localStorage` (`pq_session`) y se
  restaura en el `bootstrap`.

### 9.6 Administración

Acceso solo si `user.admin` (María Eugenia lo es). Pestañas
(`useAdminVM` / `Admin`):

| Pestaña | Contenido |
|---------|-----------|
| **Dashboard** | 10 KPIs (GMV, comisión 4 %, payout a palquistas, ingreso botana, entradas vendidas, ticket promedio, clientes, ocupación media, palcos activos, eventos·estadios), ingresos por estadio, reservas recientes, ventas por mes, dona de ingresos por modalidad y top de eventos |
| **Eventos** | Listado + alta/edición. Cada evento puede tener varias funciones (fecha+hora); el país filtra los estadios seleccionables; imágenes opcionales |
| **Estadios** | Listado + alta/edición (capacidad, año, superficie, niveles, techo, plano/foto) |
| **Palcos** | Listado completo con host, estadio, precio "desde", estado y ocupación |
| **Verificación** | Palcos `pendiente` (con badge de cantidad). Modal para **aprobar** (pasa a `publicado`) o **rechazar** marcando campos con motivo (pasa a `rechazado`) |
| **Clientes** (CRM) | Por cuenta: gasto total, nº de órdenes, puntos e historial expandible |
| **Reservas** | Todas las órdenes con cliente, fecha, total, palco y modalidad |
| **Finanzas** | Ingresos brutos, comisión 4 %, payout, ingreso botana, desglose por estadio y comisión mensual |

**Eventos y estadios creados en el admin aparecen inmediatamente en el lado
cliente** (comparten el store y se persisten en `localStorage`).

---

## 10. Persistencia (localStorage)

Los adaptadores in-memory persisten en `localStorage` para sobrevivir recargas.
Claves usadas:

| Clave | Contenido |
|-------|-----------|
| `pq_accounts` | Cuentas de usuario (se siembra/mezcla la cuenta demo en cada lectura) |
| `pq_session` | Id del usuario con sesión iniciada |
| `pq_orders` | Órdenes/reservas realizadas |
| `pq_admin_events` | Eventos creados desde el admin |
| `pq_admin_stadiums` | Estadios creados desde el admin |

Los accesos a `localStorage` están **guardados** (try/catch) para degradar a
no-op en SSR / modo privado / cuota agotada en lugar de lanzar errores.

> Para resetear la demo a su estado de fábrica, borrar estas claves del
> `localStorage` del navegador.

---

## 11. Inyección de dependencias y migración a backend

El **composition root** es `src/app/container.ts`. Allí se construye un
`Container` con todos los repositorios detrás de sus interfaces (puertos). Hoy
resuelven a adaptadores **in-memory**; el día que exista un backend, se cambia
**una sola línea**:

```ts
const DATA_SOURCE = 'memory' as 'memory' | 'http'  // ← cambiar a 'http'
const API_BASE_URL = '/api'                         // ← y fijar la URL
```

Como los consumidores dependen de los **puertos** y no de los adaptadores
concretos, no hay que tocar ningún otro archivo: `buildHttp()` ya cablea los
`Http*Repository` sobre `FetchHttpClient`. La sesión sigue siendo local
(`LocalStorageSessionStore`) en ambos modos.

---

## 12. Sistema de diseño y estilos

- **Tokens** en `src/styles/` (`tokens/fonts.css`, `radius.css`, `shadows.css`,
  `spacing.css`, `typography.css`) + `global.css`, agregados por `styles.css`.
- **Temas** (`shared/domain/theme.ts`): dos paletas como variables CSS —
  `palco` (*Palco · noche*, oscuro) y `cancha` (*Cancha · día*, claro),
  conmutables desde el header (`cycleTheme`). `App` aplica `th.vars` al
  contenedor raíz.
- **`css()`** (`shared/ui/css.ts`): parsea los strings de estilo inline del
  prototipo a objetos de estilo de React, lo que permite mantener el marcado
  fiel al diseño original.
- **Componentes compartidos** (`shared/ui/components/`): `Btn`, `Field`,
  `Toggle`, `StatTile`, `SeatGrid`, `StadiumMap`, `EventCard`, `PalcoCard`,
  `Header`, `Overlays`.
- **Biblioteca `src/lib/`**: ~80 componentes de UI de propósito general
  (Accordion, Calendar, Combobox, DataTable, Drawer, Toast, etc.) con su propio
  **sitio de documentación** (`Showcase`, code-split en `/#showcase`). Es un
  *design system* independiente del producto Palqueate.

### 12.1 Responsive

`vw` (ancho de viewport) se mantiene en el store vía listener de `resize`. Por
debajo de **860px** la navegación superior colapsa a una **barra inferior fija**
(`BottomNav`) y los layouts de admin/métricas pasan a una sola columna.

---

## 13. Detalles de implementación destacables

- **Precio "desde"** (`fromPrice`): toma la modalidad activa más barata de cada
  palco; `priceBounds` redondea el rango a múltiplos de 500 para sliders prolijos.
- **Filtrado** (`filtered`): búsqueda por texto (título, sector, host, estadio),
  multiselect de estadios, tipo de modalidad, estacionamiento, mínimo de
  asientos y rango de precio; orden por relevancia, precio, asientos o rating.
- **Funciones de evento**: toda la disponibilidad de `seatEvent` se indexa por
  **id de función** (`occId`). Para eventos de fecha única ese id coincide con
  el del evento, lo que mantiene la compatibilidad.
- **Métricas determinísticas**: vistas, favoritos y tendencias se derivan de un
  hash del id del palco (`idHash`) para que la demo sea estable entre recargas
  (no usa `Math.random()` para esos números).
- **Carteles promocionales** (`promoPoster`): genera posters/gradientes para los
  eventos sin imagen real.

---

## 14. Limitaciones conocidas / naturaleza de demo

- **Sin backend**: todo es cliente; los pagos son simulados (delay de 1.3 s).
- **Login de demo**: "Ingresar" siempre entra a María Eugenia, sin verificar
  contraseña (el registro sí valida y crea cuentas reales en `localStorage`).
- **Datos en el dispositivo**: las reservas y cuentas viven en el `localStorage`
  del navegador; no se comparten entre dispositivos ni se respaldan.
- **Sin tests automatizados ni linter**; la garantía de calidad es el type-check.
- **Varios slices** usan `// @ts-nocheck` (port casi literal del prototipo), por
  lo que parte del store no está cubierto por el chequeo de tipos estricto.

---

## 15. Glosario

| Término | Significado |
|---------|-------------|
| **Palco** | Box privado en un estadio, con varios asientos |
| **Palquista** | Dueño de un palco que lo publica/alquila |
| **Modalidad** | Forma de alquiler: palco entero, asiento anual o asiento por evento |
| **Función** | Una fecha+hora concreta de un evento (`EventOccurrence`) |
| **Botana** | Menú de comidas y bebidas asociado a una reserva |
| **GMV** | *Gross Merchandise Value* — ventas brutas totales |
| **Payout** | Monto neto a transferir a los palquistas (GMV − comisión) |
| **Comisión** | 4 % que retiene la plataforma sobre cada reserva |
```
