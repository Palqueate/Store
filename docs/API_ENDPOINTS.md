# Palqueate — Diseño de Endpoints de la API

> Documento de diseño del backend que sirve a la app **Palqueate** (marketplace de
> alquiler de palcos en estadios). Define **todos** los endpoints que el front
> necesita, manteniéndolos en su mínima expresión: **un click del usuario = una sola
> llamada HTTP**, aunque el backend tenga que ejecutar varias acciones internamente.
>
> Los endpoints están **siempre en inglés**. La documentación está en español.

---

## 1. Convenciones generales

| Tema | Decisión |
|------|----------|
| Base URL | `/api/v1` |
| Formato | `application/json` en request y response (las imágenes viajan como *data URL* en strings, igual que el front actual) |
| Autenticación | `Authorization: Bearer <token>` (JWT). El token se obtiene en `login`/`register` |
| Dinero | Entero en pesos uruguayos (UYU). Ej: `1200000` = $U 1.200.000. **Nunca** decimales |
| Fechas | ISO‑8601 string (`"2026-03-14T17:00:00Z"`) |
| IDs | String opaco. El backend los genera; el front nunca los inventa |
| Errores | `{ "error": { "code": string, "message": string, "fields"?: object } }` con status HTTP acorde |
| Paginación | `?page` (1‑based) y `?pageSize` cuando la colección puede crecer (listados admin) |

### Niveles de acceso

| Símbolo | Nivel | Significado |
|---------|-------|-------------|
| 🟢 | **Público** | No requiere token |
| 🔵 | **Autenticado** | Requiere token válido (cualquier usuario logueado) |
| 🟣 | **Autenticado + Dueño** | Token válido **y** ser el dueño del recurso (self / palquista del palco / titular de la orden) |
| 🔴 | **Autenticado + Admin** | Token válido **y** rol `admin` (autorización por rol) |

```json
{
  "accessLevels": {
    "public":        { "auth": false, "authorization": null },
    "authenticated": { "auth": true,  "authorization": null },
    "owner":         { "auth": true,  "authorization": "resource-owner" },
    "admin":         { "auth": true,  "authorization": "role:admin" }
  }
}
```

---

## 2. Tabla resumen de endpoints

| # | Método | Path | Acceso | Acciones que colapsa (1 llamada) |
|---|--------|------|--------|----------------------------------|
| 1 | GET | `/bootstrap` | 🟢 | Carga inicial completa: estadios + eventos + palcos públicos + catálogo de comida + tipos de evento + rango de precios + sesión y pedidos del usuario |
| 2 | POST | `/auth/register` | 🟢 | Crea cuenta + abre sesión + devuelve token |
| 3 | POST | `/auth/login` | 🟢 | Valida credenciales + abre sesión + devuelve token y pedidos |
| 4 | POST | `/auth/logout` | 🔵 | Cierra sesión |
| 5 | GET | `/me` | 🔵 | Usuario actual + sus pedidos |
| 6 | PATCH | `/accounts/{id}` | 🟣 | Update parcial: perfil / notificaciones / estadio fav / idioma / foto (cualquier subconjunto) |
| 7 | GET | `/stadiums` | 🟢 | Lista de estadios |
| 8 | GET | `/stadiums/{id}` | 🟢 | Detalle de estadio |
| 9 | POST | `/stadiums` | 🔴 | Alta de estadio |
| 10 | PUT | `/stadiums/{id}` | 🔴 | Edición de estadio |
| 11 | GET | `/events` | 🟢 | Lista de eventos |
| 12 | GET | `/events/{id}` | 🟢 | Detalle de evento + funciones |
| 13 | GET | `/events/{id}/palcos` | 🟢 | Palcos con disponibilidad para una función (lista + asientos libres + markers del plano) |
| 14 | POST | `/events` | 🔴 | Alta de evento: arma las funciones (fecha+hora) desde el array de fechas |
| 15 | PUT | `/events/{id}` | 🔴 | Edición de evento |
| 16 | GET | `/palcos` | 🟢 | Catálogo público filtrado + rango de precios (filtros server‑side) |
| 17 | GET | `/palcos/{id}` | 🟢 | Detalle de palco con disponibilidad por modalidad |
| 18 | POST | `/palcos` | 🔵 | Publica palco nuevo (queda `pendiente` de verificación) |
| 19 | PUT | `/palcos/{id}` | 🟣 | Edita palco propio (vuelve a `pendiente`) |
| 20 | PUT | `/palcos/{id}/status` | 🟣 | Pausa / reactiva publicación |
| 21 | POST | `/palcos/{id}/resubmit` | 🟣 | Guarda respuestas a campos observados **y** reenvía a revisión (1 llamada) |
| 22 | POST | `/palcos/{id}/review` | 🔴 | Verificación: aprueba **o** rechaza + registra review + notifica al palquista |
| 23 | POST | `/orders` | 🔵 | Pago: calcula subtotal/comisión/total + genera código + reserva asientos + crea orden |
| 24 | POST | `/orders/{code}/food` | 🟣 | Agrega botana a una reserva: calcula total + adjunta a la orden |
| 25 | GET | `/owner/palcos` | 🔵 | Palcos del palquista (todos los estados) |
| 26 | GET | `/owner/metrics` | 🔵 | Métricas agregadas del palquista (recaudación, ocupación, vistas, por evento) |
| 27 | GET | `/admin/dashboard` | 🔴 | Todos los KPIs + gráficos del panel en una sola llamada |
| 28 | GET | `/admin/palcos` | 🔴 | Todos los palcos (incluye cola de verificación con `?status=pendiente`) |
| 29 | GET | `/admin/orders` | 🔴 | Todas las reservas |
| 30 | GET | `/admin/clients` | 🔴 | CRM: clientes con sus métricas de compra |

---

## 3. Detalle de endpoints

A continuación cada endpoint con: **path params**, **query params** y **body** (en
tabla y en JSON), nivel de acceso, y la **respuesta** con su tipo de dato.

---

### 1. `GET /bootstrap` 🟢

Una sola llamada al abrir la app. Reemplaza las 8 llamadas paralelas que hoy hace
`bootstrap()`. Si se manda token, además resuelve la sesión y devuelve al usuario con
sus pedidos.

**Headers:** `Authorization: Bearer <token>` *(opcional)*

Sin path ni query params. Sin body.

**Respuesta `200`:**

```json
{
  "stadiums":   "Stadium[]",
  "events":     "Ev[]",
  "palcos":     "Palco[]",
  "foodItems":  "FoodItem[]",
  "foodCats":   "FoodCat[]",
  "eventTypes": "EventType[]",
  "priceBounds": { "lo": "number", "hi": "number", "step": "number" },
  "session": {
    "user":   "User | null",
    "orders": "Order[]"
  }
}
```

---

### 2. `POST /auth/register` 🟢

Crea la cuenta, abre sesión y devuelve el token. (Colapsa: alta de cuenta + login.)

**Body**

| Campo | Tipo | Req. | Regla |
|-------|------|------|-------|
| `name` | string | sí | mín. 2 caracteres |
| `email` | string | sí | email válido, único |
| `phone` | string | no | — |
| `pass` | string | sí | mín. 4 caracteres |

```json
{ "name": "string", "email": "string", "phone": "string?", "pass": "string" }
```

**Respuesta `201`:**

```json
{ "token": "string", "user": "User" }
```

**Errores:** `409` email ya registrado · `422` validación (`error.fields`).

---

### 3. `POST /auth/login` 🟢

Valida credenciales, abre sesión y devuelve token + pedidos del usuario (evita un
segundo `GET /orders` tras loguear).

**Body**

| Campo | Tipo | Req. |
|-------|------|------|
| `email` | string | sí |
| `pass` | string | sí |

```json
{ "email": "string", "pass": "string" }
```

**Respuesta `200`:**

```json
{ "token": "string", "user": "User", "orders": "Order[]" }
```

**Errores:** `401` credenciales inválidas.

---

### 4. `POST /auth/logout` 🔵

Invalida la sesión actual. Sin body.

**Respuesta `204`:** *(sin cuerpo)*

---

### 5. `GET /me` 🔵

Usuario actual + sus pedidos. Útil para rehidratar tras recargar.

**Respuesta `200`:**

```json
{ "user": "User", "orders": "Order[]" }
```

---

### 6. `PATCH /accounts/{id}` 🟣

Update **parcial** del perfil. Un solo endpoint para todas las ediciones de la pantalla
de cuenta: datos personales, notificaciones, estadio favorito, idioma y foto. El front
manda **sólo los campos que cambiaron**.

**Path params**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | Id del usuario (debe coincidir con el del token) |

```json
{ "id": "string" }
```

**Body** (todos opcionales — partial update)

| Campo | Tipo | Notas |
|-------|------|-------|
| `name` | string | mín. 2 |
| `email` | string | único |
| `phone` | string | |
| `ci` | string | documento |
| `birth` | string | |
| `city` | string | |
| `address` | string | |
| `country` | string | |
| `favStadium` | string | id de estadio |
| `lang` | string | |
| `photo` | string \| null | data URL; `null` la elimina |
| `notif` | object | `{ email?, sms?, push?, promos? }` (boolean) |

```json
{
  "name": "string?", "email": "string?", "phone": "string?",
  "ci": "string?", "birth": "string?", "city": "string?",
  "address": "string?", "country": "string?",
  "favStadium": "string?", "lang": "string?",
  "photo": "string | null?",
  "notif": { "email": "boolean?", "sms": "boolean?", "push": "boolean?", "promos": "boolean?" }
}
```

**Respuesta `200`:** el usuario actualizado.

```json
{ "user": "User" }
```

**Errores:** `403` si `id` ≠ usuario del token · `409` email en uso · `422` validación.

---

### 7. `GET /stadiums` 🟢

Sin params. **Respuesta `200`:** `Stadium[]`.

```json
[ { "id": "string", "name": "string", "short": "string", "city": "string",
    "country": "string?", "shape": "string", "capacity": "number?",
    "year": "number | null?", "surface": "string?", "levels": "number?",
    "address": "string?", "roof": "boolean?", "mapImage": "string?" } ]
```

---

### 8. `GET /stadiums/{id}` 🟢

**Path params**

| Param | Tipo |
|-------|------|
| `id` | string |

```json
{ "id": "string" }
```

**Respuesta `200`:** `Stadium` · **`404`** si no existe.

---

### 9. `POST /stadiums` 🔴

Alta de estadio (panel admin). El backend deriva `short` y normaliza numéricos.

**Body**

| Campo | Tipo | Req. |
|-------|------|------|
| `name` | string | sí |
| `short` | string | no (se deriva del nombre si falta) |
| `city` | string | no |
| `country` | string | no |
| `address` | string | no |
| `capacity` | number | no |
| `year` | number \| null | no |
| `surface` | string | no |
| `levels` | number | no |
| `roof` | boolean | no |
| `mapImage` | string | no (data URL del plano) |

```json
{
  "name": "string", "short": "string?", "city": "string?", "country": "string?",
  "address": "string?", "capacity": "number?", "year": "number | null?",
  "surface": "string?", "levels": "number?", "roof": "boolean?", "mapImage": "string?"
}
```

**Respuesta `201`:** `Stadium` (con `id` asignado).

---

### 10. `PUT /stadiums/{id}` 🔴

Edición completa de estadio.

**Path params:** `{ "id": "string" }` · **Body:** igual que `POST /stadiums`.

**Respuesta `200`:** `Stadium`.

---

### 11. `GET /events` 🟢

Lista de eventos para la grilla. Sin params.

**Respuesta `200`:** `Ev[]`.

```json
[ { "id": "string", "stadium": "string", "country": "string?",
    "comp": "string", "round": "string", "opp": "string",
    "month": "string", "day": "string", "dow": "string", "time": "string",
    "dates": [ { "id": "string", "month": "string", "day": "string",
                 "dow": "string", "time": "string", "iso": "string?" } ],
    "tag": "string", "label": "string", "type": "string?", "iso": "string?",
    "images": "string[]?", "obs": "string?" } ]
```

---

### 12. `GET /events/{id}` 🟢

**Path params:** `{ "id": "string" }`. **Respuesta `200`:** `Ev` · **`404`**.

---

### 13. `GET /events/{id}/palcos` 🟢

Palcos con disponibilidad **para una función concreta** del evento. Colapsa: listar
palcos del estadio + calcular asientos libres por función + armar los markers del plano.

**Path params**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | Id del evento |

**Query params**

| Param | Tipo | Req. | Descripción |
|-------|------|------|-------------|
| `occurrenceId` | string | no | Id de la función (fecha+hora). Si falta, usa la primera |

```json
{ "path": { "id": "string" }, "query": { "occurrenceId": "string?" } }
```

**Respuesta `200`:**

```json
{
  "occurrenceId": "string",
  "boxes": "number",
  "freeTotal": "number",
  "minPrice": "number",
  "palcos": [
    {
      "id": "string", "title": "string", "sector": "string",
      "rating": "number", "stadium": "string",
      "map": { "x": "number", "y": "number" },
      "seats": "number", "free": "number", "soldOut": "boolean",
      "parking": { "has": "boolean", "n": "number" },
      "price": "number"
    }
  ]
}
```

---

### 14. `POST /events` 🔴

Alta de evento. El front manda el array crudo de fechas; el **backend arma las
funciones** (`dates`/`occurrences`) con id, día, mes, día de semana y hora, y deriva
`tag`/`label`/`country`. (Colapsa: normalización de N fechas + creación.)

**Body**

| Campo | Tipo | Req. | Notas |
|-------|------|------|-------|
| `type` | string | sí | id de `EventType` |
| `stadium` | string | sí | id de estadio |
| `country` | string | no | por defecto, el del estadio |
| `comp` | string | no | si falta, usa el nombre del tipo |
| `round` | string | no | |
| `opp` | string | sí | nombre del evento / rival |
| `dates` | array | sí | `[{ date: "YYYY-MM-DD", time: "HH:mm" }]`, mín. 1 |
| `images` | string[] | no | data URLs |
| `obs` | string | no | nota libre |

```json
{
  "type": "string", "stadium": "string", "country": "string?",
  "comp": "string?", "round": "string?", "opp": "string",
  "dates": [ { "date": "string", "time": "string" } ],
  "images": "string[]?", "obs": "string?"
}
```

**Respuesta `201`:** `Ev` (con `dates` ya armado).

**Errores:** `422` si no hay fechas válidas o falta `opp`.

---

### 15. `PUT /events/{id}` 🔴

Edición de evento. **Path:** `{ "id": "string" }` · **Body:** igual que `POST /events`.
**Respuesta `200`:** `Ev`.

---

### 16. `GET /palcos` 🟢

Catálogo **público** (sólo `publicado`/`alquilado`) con **filtros y orden resueltos en
el backend**, más el rango de precios para los sliders. Evita traer todo y filtrar en
cliente.

**Query params**

| Param | Tipo | Req. | Descripción |
|-------|------|------|-------------|
| `q` | string | no | búsqueda por texto (título/sector/host/estadio) |
| `stadium` | string (CSV) | no | uno o varios ids de estadio |
| `type` | enum | no | `palcoYear` \| `seatYear` \| `seatEvent` |
| `parking` | boolean | no | sólo con estacionamiento |
| `minSeats` | number | no | mínimo de asientos |
| `minPrice` | number | no | precio "desde" ≥ |
| `maxPrice` | number | no | precio "desde" ≤ |
| `sort` | enum | no | `price` \| `seats` \| `rating` (default `rating`) |
| `page` | number | no | paginación |
| `pageSize` | number | no | paginación |

```json
{
  "q": "string?", "stadium": "string?", "type": "string?",
  "parking": "boolean?", "minSeats": "number?",
  "minPrice": "number?", "maxPrice": "number?", "sort": "string?",
  "page": "number?", "pageSize": "number?"
}
```

**Respuesta `200`:**

```json
{
  "palcos": "Palco[]",
  "total": "number",
  "priceBounds": { "lo": "number", "hi": "number", "step": "number" }
}
```

---

### 17. `GET /palcos/{id}` 🟢

Detalle de palco con disponibilidad por modalidad (`modes.*.taken`).

**Path params:** `{ "id": "string" }`.

**Respuesta `200`:** `Palco` · **`404`**.

```json
{
  "id": "string", "stadium": "string", "country": "string?",
  "title": "string", "sector": "string",
  "map": { "x": "number", "y": "number" },
  "seats": "number",
  "parking": { "has": "boolean", "n": "number" },
  "amenities": "string[]?",
  "coOwners": [ { "name": "string", "email": "string" } ],
  "host": "string", "rating": "number", "photos": "number", "images": "string[]",
  "modes": {
    "palcoYear": { "on": "boolean", "price": "number" },
    "seatYear":  { "on": "boolean", "price": "number", "taken": "number[]" },
    "seatEvent": { "on": "boolean", "price": "number", "taken": "Record<string, number[]>" }
  },
  "status": "'pendiente' | 'rechazado' | 'publicado' | 'pausado' | 'alquilado'",
  "review": "PalcoReview?"
}
```

> Nota: `payout` (datos bancarios/documentos) **nunca** se devuelve en endpoints
> públicos; sólo viaja en alta/edición del propio palquista y en la verificación admin.

---

### 18. `POST /palcos` 🔵

Publica un palco nuevo desde el wizard del palquista. El backend lo crea en estado
`pendiente` (entra a verificación), deriva `sector`/`country` del estadio y fija
`host`/`rating` iniciales.

**Body**

| Campo | Tipo | Req. | Notas |
|-------|------|------|-------|
| `stadium` | string | sí | id de estadio |
| `title` | string | no | default "Mi palco" |
| `map` | object | sí | `{ x: number, y: number }` |
| `seats` | number | sí | 1–40 |
| `parking` | object | sí | `{ has: boolean, n: number }` |
| `amenities` | string[] | sí | ≥ 1 |
| `coOwners` | array | no | `[{ name, email }]` |
| `payout` | object | sí | datos de cobro + documentos (ver `PalcoPayout`) |
| `images` | string[] | sí | ≥ 3 data URLs |
| `modes` | object | sí | al menos una modalidad `on` |

```json
{
  "stadium": "string", "title": "string?",
  "map": { "x": "number", "y": "number" },
  "seats": "number",
  "parking": { "has": "boolean", "n": "number" },
  "amenities": "string[]",
  "coOwners": [ { "name": "string", "email": "string" } ],
  "payout": {
    "country": "string", "swift": "string", "bank": "string",
    "beneficiary": "string", "accountNumber": "string", "branch": "string",
    "idFront": "string", "idBack": "string",
    "proofOfAddress": "string", "propertyTitle": "string"
  },
  "images": "string[]",
  "modes": {
    "palcoYear": { "on": "boolean", "price": "number" },
    "seatYear":  { "on": "boolean", "price": "number" },
    "seatEvent": { "on": "boolean", "price": "number" }
  }
}
```

**Respuesta `201`:** `Palco` (status `pendiente`).

**Errores:** `422` validación (fotos < 3, sin modalidad, payout incompleto…).

---

### 19. `PUT /palcos/{id}` 🟣

Edición de palco propio. **Cualquier cambio lo devuelve a `pendiente`**: el backend
preserva identidad, reputación y asientos ya alquilados, aplica los cambios y reinicia
la verificación. (Colapsa: actualizar + reset de estado.)

**Path params:** `{ "id": "string" }` · **Body:** igual que `POST /palcos`.

**Respuesta `200`:** `Palco` (status `pendiente`).

**Errores:** `403` si el solicitante no es el palquista · `404`.

---

### 20. `PUT /palcos/{id}/status` 🟣

Pausa o reactiva la publicación de un palco propio.

**Path params:** `{ "id": "string" }`.

**Body**

| Campo | Tipo | Valores |
|-------|------|---------|
| `status` | enum | `pausado` \| `publicado` |

```json
{ "status": "'pausado' | 'publicado'" }
```

**Respuesta `200`:** `{ "id": "string", "status": "string" }`.

**Errores:** `409` si el palco está `alquilado` (no se puede pausar) · `403` · `404`.

---

### 21. `POST /palcos/{id}/resubmit` 🟣

El palquista responde a los campos observados por el admin **y** reenvía el palco a
revisión, en **una sola llamada** (hoy son N guardados de respuestas + 1 cambio de
estado). Pasa de `rechazado` → `pendiente`.

**Path params:** `{ "id": "string" }`.

**Body**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `replies` | array | Respuestas a los campos marcados: `[{ key, ownerReply }]` |

```json
{ "replies": [ { "key": "string", "ownerReply": "string" } ] }
```

**Respuesta `200`:** `Palco` (status `pendiente`, con `review.fields[].ownerReply`).

**Errores:** `409` si el palco no está `rechazado` · `403` · `404`.

---

### 22. `POST /palcos/{id}/review` 🔴

Verificación del palco por el admin. **Un endpoint para aprobar o rechazar**: cambia el
estado, persiste el registro de revisión y **dispara la notificación** al palquista.
(Colapsa: cambio de estado + registro de review + notificación.)

**Path params:** `{ "id": "string" }`.

**Body**

| Campo | Tipo | Req. | Descripción |
|-------|------|------|-------------|
| `decision` | enum | sí | `approve` \| `reject` |
| `reason` | string | si `reject` | motivo general del rechazo |
| `fields` | array | si `reject` | campos observados: `[{ key, label, reason }]` |

```json
{
  "decision": "'approve' | 'reject'",
  "reason": "string?",
  "fields": [ { "key": "string", "label": "string", "reason": "string" } ]
}
```

**Respuesta `200`:** `Palco` actualizado.
- `approve` → `status: "publicado"`, sin `review`.
- `reject` → `status: "rechazado"`, con `review: { reason, fields, reviewedAt }`.

**Errores:** `422` si `reject` sin motivo ni campos, o algún campo sin `reason`.

---

### 23. `POST /orders` 🔵

**El pago.** El front manda el carrito y el contacto; el **backend hace todo**: valida
disponibilidad, **calcula subtotal + comisión (4%) + total**, **genera el código**,
**reserva los asientos** (marca `taken` en cada palco/modalidad) y **crea la orden**.
Una sola llamada en vez de calcular en cliente + crear + refrescar disponibilidad.

**Body**

| Campo | Tipo | Req. | Descripción |
|-------|------|------|-------------|
| `items` | array | sí | Ítems del carrito (ver abajo) |
| `contact` | object | no | `{ name, email }` (default: los del usuario) |
| `payMethod` | enum | no | `card` \| `transfer` (default `card`) |

Ítem del carrito:

| Campo | Tipo | Notas |
|-------|------|-------|
| `palcoId` | string | |
| `mode` | enum | `palcoYear` \| `seatYear` \| `seatEvent` |
| `seats` | number[] | vacío para `palcoYear` |
| `eventId` | string | sólo `seatEvent` |
| `occurrenceId` | string | sólo `seatEvent` |

```json
{
  "items": [
    {
      "palcoId": "string",
      "mode": "'palcoYear' | 'seatYear' | 'seatEvent'",
      "seats": "number[]",
      "eventId": "string?",
      "occurrenceId": "string?"
    }
  ],
  "contact": { "name": "string?", "email": "string?" },
  "payMethod": "'card' | 'transfer'?"
}
```

> El front **no** manda precios ni totales: el backend los toma del palco y los recalcula
> (fuente de verdad del precio, evita manipulación).

**Respuesta `201`:** `Order`.

```json
{
  "code": "string", "userId": "string",
  "subtotal": "number", "fee": "number", "total": "number",
  "date": "string",
  "contact": { "name": "string", "email": "string" },
  "items": [
    {
      "uid": "string", "palcoId": "string", "palcoTitle": "string", "stadium": "string",
      "mode": "string", "modeLabel": "string", "seats": "number[]",
      "term": "string", "qty": "number", "price": "number",
      "eventId": "string?", "occurrenceId": "string?",
      "eventLabel": "string?", "eventOpp": "string?"
    }
  ],
  "food": "Array<{ id: string, name: string, qty: number, price: number }>",
  "foodTotal": "number"
}
```

**Errores:** `409` asiento ya tomado (carrera) → el front refresca disponibilidad ·
`422` carrito vacío · `401` sin sesión.

---

### 24. `POST /orders/{code}/food` 🟣

Agrega botana y bebidas a una reserva ya pagada. El backend **calcula el total de la
comida** y lo adjunta a la orden. (Colapsa: armar líneas + recalcular + actualizar.)

**Path params**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `code` | string | Código de la orden |

```json
{ "code": "string" }
```

**Body**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `items` | array | `[{ id, qty }]` (ids del catálogo de comida) |

```json
{ "items": [ { "id": "string", "qty": "number" } ] }
```

**Respuesta `200`:** `Order` actualizada (con `food` y `foodTotal` acumulados).

**Errores:** `403` si la orden no es del usuario · `404` · `422` pedido vacío.

---

### 25. `GET /owner/palcos` 🔵

Palcos del palquista logueado, en **todos** los estados (pendiente, rechazado,
publicado, pausado, alquilado) — incluye `review` y `payout` propios.

**Query params**

| Param | Tipo | Req. | Descripción |
|-------|------|------|-------------|
| `status` | enum | no | filtra por estado |

```json
{ "status": "string?" }
```

**Respuesta `200`:** `Palco[]`.

---

### 26. `GET /owner/metrics` 🔵

Métricas agregadas del palquista, calculadas en el backend (hoy se computan en cliente
en `useMetricsVM`). Una llamada devuelve KPIs, recaudación por modalidad, ventas por
evento, tendencia y la tabla por palco.

**Query params**

| Param | Tipo | Req. | Descripción |
|-------|------|------|-------------|
| `palcoId` | string | no | `all` (default) o un id de palco propio |

```json
{ "palcoId": "string?" }
```

**Respuesta `200`:**

```json
{
  "scope": "string",
  "kpis": {
    "revenue": "number",
    "annualOccupancy": "number",
    "annualSeats": "number",
    "annualCapacity": "number",
    "eventTickets": "number",
    "views": "number",
    "conversion": "number"
  },
  "revenueByMode": { "annual": "number", "perEvent": "number" },
  "byEvent": [ { "eventId": "string", "opp": "string", "day": "string", "month": "string", "sold": "number", "revenue": "number" } ],
  "trend": [ { "month": "string", "value": "number" } ],
  "palcos": [
    {
      "id": "string", "title": "string", "stadiumName": "string",
      "rating": "number", "status": "string",
      "revenue": "number", "occupancy": "number",
      "annualSeats": "number", "annualCapacity": "number",
      "views": "number", "favs": "number", "eventTickets": "number"
    }
  ]
}
```

---

### 27. `GET /admin/dashboard` 🔴

**Todo el panel admin en una llamada.** Reemplaza ~10 cálculos que hoy corren en
cliente sobre todas las órdenes, palcos y cuentas (GMV, comisión, payout, ingreso
botana, entradas vendidas, ticket promedio, ocupación media, ventas por estadio, ventas
por mes, mix de modalidades, top de eventos, reservas recientes).

**Query params**

| Param | Tipo | Req. | Descripción |
|-------|------|------|-------------|
| `period` | string | no | `season` (default) / `month` / rango |

```json
{ "period": "string?" }
```

**Respuesta `200`:**

```json
{
  "kpis": {
    "gmv": "number", "commission": "number", "payout": "number",
    "foodRevenue": "number", "ticketsSold": "number", "avgTicket": "number",
    "clients": "number", "avgOccupancy": "number",
    "activePalcos": "number", "totalPalcos": "number",
    "events": "number", "stadiums": "number"
  },
  "revenueByStadium": [ { "stadiumId": "string", "name": "string", "value": "number" } ],
  "monthlySales": [ { "month": "string", "value": "number" } ],
  "modality": {
    "palcoYear": "number", "seatYear": "number", "seatEvent": "number"
  },
  "topEvents": [ { "eventId": "string", "opp": "string", "comp": "string", "date": "string", "revenue": "number" } ],
  "recentOrders": [ { "code": "string", "client": "string", "total": "number", "date": "string" } ],
  "finance": {
    "gross": "number", "commission": "number", "payout": "number", "foodRevenue": "number",
    "byStadium": [ { "name": "string", "revenue": "number", "commission": "number", "payout": "number" } ],
    "monthlyCommission": [ { "month": "string", "value": "number" } ]
  }
}
```

---

### 28. `GET /admin/palcos` 🔴

Todos los palcos para la tabla admin y la **cola de verificación**.

**Query params**

| Param | Tipo | Req. | Descripción |
|-------|------|------|-------------|
| `status` | enum | no | `pendiente` para la cola de verificación |
| `stadium` | string | no | filtra por estadio |
| `page` / `pageSize` | number | no | paginación |

```json
{ "status": "string?", "stadium": "string?", "page": "number?", "pageSize": "number?" }
```

**Respuesta `200`:**

```json
{ "palcos": "Palco[]", "total": "number", "pendingCount": "number" }
```

> En contexto admin, cada `Palco` **sí** incluye `payout` y `review` para poder verificar.

---

### 29. `GET /admin/orders` 🔴

Todas las reservas de la plataforma.

**Query params**

| Param | Tipo | Req. | Descripción |
|-------|------|------|-------------|
| `userId` | string | no | filtra por cliente |
| `page` / `pageSize` | number | no | paginación |

```json
{ "userId": "string?", "page": "number?", "pageSize": "number?" }
```

**Respuesta `200`:** `{ "orders": "Order[]", "total": "number" }`.

---

### 30. `GET /admin/clients` 🔴

CRM: clientes con sus métricas de compra agregadas (hoy se calcula en cliente en
`adminClients`).

**Query params**

| Param | Tipo | Req. | Descripción |
|-------|------|------|-------------|
| `q` | string | no | búsqueda por nombre/email |
| `page` / `pageSize` | number | no | paginación |

```json
{ "q": "string?", "page": "number?", "pageSize": "number?" }
```

**Respuesta `200`:**

```json
{
  "clients": [
    {
      "id": "string", "name": "string", "email": "string", "phone": "string?",
      "isAdmin": "boolean", "points": "number",
      "ordersCount": "number", "spent": "number",
      "orders": [ { "code": "string", "date": "string", "total": "number", "items": "number" } ]
    }
  ],
  "total": "number"
}
```

---

## 4. Matriz de autenticación / autorización

```json
{
  "public": [
    "GET /bootstrap", "POST /auth/register", "POST /auth/login",
    "GET /stadiums", "GET /stadiums/{id}",
    "GET /events", "GET /events/{id}", "GET /events/{id}/palcos",
    "GET /palcos", "GET /palcos/{id}"
  ],
  "authenticated": [
    "POST /auth/logout", "GET /me",
    "POST /palcos", "POST /orders",
    "GET /owner/palcos", "GET /owner/metrics"
  ],
  "owner": [
    "PATCH /accounts/{id}",
    "PUT /palcos/{id}", "PUT /palcos/{id}/status",
    "POST /palcos/{id}/resubmit",
    "POST /orders/{code}/food"
  ],
  "admin": [
    "POST /stadiums", "PUT /stadiums/{id}",
    "POST /events", "PUT /events/{id}",
    "POST /palcos/{id}/review",
    "GET /admin/dashboard", "GET /admin/palcos",
    "GET /admin/orders", "GET /admin/clients"
  ]
}
```

| Endpoint | Autenticación | Autorización |
|----------|:---:|:---|
| `GET /bootstrap` | Opcional | — |
| `POST /auth/register` | No | — |
| `POST /auth/login` | No | — |
| `POST /auth/logout` | Sí | — |
| `GET /me` | Sí | — |
| `PATCH /accounts/{id}` | Sí | Self (`id` == token) |
| `GET /stadiums` · `GET /stadiums/{id}` | No | — |
| `POST /stadiums` · `PUT /stadiums/{id}` | Sí | Rol `admin` |
| `GET /events` · `GET /events/{id}` · `GET /events/{id}/palcos` | No | — |
| `POST /events` · `PUT /events/{id}` | Sí | Rol `admin` |
| `GET /palcos` · `GET /palcos/{id}` | No | — |
| `POST /palcos` | Sí | — |
| `PUT /palcos/{id}` | Sí | Dueño (palquista) |
| `PUT /palcos/{id}/status` | Sí | Dueño (palquista) |
| `POST /palcos/{id}/resubmit` | Sí | Dueño (palquista) |
| `POST /palcos/{id}/review` | Sí | Rol `admin` |
| `POST /orders` | Sí | — |
| `POST /orders/{code}/food` | Sí | Titular de la orden |
| `GET /owner/palcos` · `GET /owner/metrics` | Sí | Palquista (sus palcos) |
| `GET /admin/*` | Sí | Rol `admin` |

---

## 5. Decisiones de diseño "1 click = 1 llamada"

Resumen de dónde el endpoint absorbe varias acciones de backend para no multiplicar
llamadas desde el front:

| Acción del usuario | Antes (varias) | Ahora (1 endpoint) |
|--------------------|----------------|--------------------|
| Abrir la app | 8 GET en paralelo (estadios, eventos, palcos, comida×2, cuentas, órdenes, sesión) | `GET /bootstrap` |
| Registrarse / iniciar sesión | crear cuenta + abrir sesión + cargar pedidos | `POST /auth/register` · `POST /auth/login` |
| Guardar perfil / preferencias / foto | un PUT por cada cambio | `PATCH /accounts/{id}` (partial) |
| Pagar el carrito | calcular totales (cliente) + crear orden + reservar asientos | `POST /orders` |
| Agregar botana | armar líneas + recalcular + actualizar orden | `POST /orders/{code}/food` |
| Publicar / editar palco | crear/editar + (re)setear estado de verificación | `POST /palcos` · `PUT /palcos/{id}` |
| Reenviar palco rechazado | N respuestas a campos + cambio de estado | `POST /palcos/{id}/resubmit` |
| Verificar palco (admin) | cambio de estado + registro de review + notificación | `POST /palcos/{id}/review` |
| Crear evento (admin) | normalizar N fechas (cliente) + crear | `POST /events` |
| Panel admin | ~10 agregaciones sobre todas las órdenes/palcos/cuentas en cliente | `GET /admin/dashboard` |
| Métricas del palquista | agregaciones en cliente | `GET /owner/metrics` |
| Catálogo con filtros | traer todo + filtrar/ordenar/rango en cliente | `GET /palcos` (server‑side) |
| Disponibilidad por evento | listar palcos + calcular libres por función | `GET /events/{id}/palcos` |
```
