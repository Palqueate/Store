# Palqueate — Especificación de Requerimientos del Sistema

> Documento de requisitos. Describe **qué** debe hacer y **cómo** debe
> comportarse el sistema Palqueate, sin entrar en cómo está construido. Sirve
> como referencia para producto, diseño, desarrollo, testing y negocio.

| | |
|---|---|
| **Producto** | Palqueate — marketplace de alquiler de palcos de estadio |
| **Versión del documento** | 1.0 |
| **Fecha** | 2026-06-29 |
| **Estado** | Vigente |
| **Documento relacionado** | `DOCUMENTACION.md` (visión de producto y negocio) |

---

## 1. Introducción

### 1.1 Propósito
Definir, de forma ordenada y verificable, todos los requerimientos del sistema
Palqueate: lo que cada rol puede hacer, las reglas de negocio que el sistema debe
hacer cumplir y las características de calidad esperadas (rendimiento, usabilidad,
seguridad, etc.).

### 1.2 Alcance
Palqueate es una aplicación web que conecta a **dueños de palcos** con **hinchas**
que quieren alquilarlos para asistir a partidos y shows, e incluye un panel de
**administración** para operar el marketplace. El sistema cubre: publicación y
verificación de palcos, agenda de eventos, búsqueda y reserva, cobro con comisión,
pedidos de comida/bebida (botana), gestión de cuentas y un tablero de negocio
(CRM + finanzas).

### 1.3 Audiencia
Equipo de producto, diseño, desarrollo y QA; stakeholders de negocio; nuevas
incorporaciones que necesiten una referencia precisa del comportamiento esperado.

### 1.4 Definiciones
Ver glosario en `DOCUMENTACION.md`. Términos centrales: *palco, palquista, hincha,
modalidad, evento, función, temporada, botana, verificación, comisión, payout, GMV*.

### 1.5 Convenciones
Los requerimientos se identifican con prefijos:
- **RF** — Requerimiento Funcional
- **RN** — Regla de Negocio
- **RNF** — Requerimiento No Funcional
- **RD** — Requerimiento de Datos
- **RI** — Requerimiento de Interfaz

Las palabras **debe** (obligatorio), **debería** (recomendado) y **puede**
(opcional) se usan con ese significado.

---

## 2. Descripción general

### 2.1 Roles del sistema

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **Visitante** | Usuario sin sesión iniciada | Navegar y explorar; debe identificarse para reservar |
| **Cliente / hincha** | Usuario registrado que reserva | Reservar, pagar, pedir botana, gestionar su cuenta |
| **Palquista / dueño** | Usuario que publica palcos | Publicar, editar, pausar y medir sus palcos |
| **Administrador** | Equipo de Palqueate | Operar la plataforma: eventos, estadios, verificación, CRM, finanzas |

Un mismo usuario puede acumular los roles de cliente y palquista. El rol de
administrador es una atribución especial de la cuenta.

### 2.2 Supuestos y dependencias
- El usuario accede desde un **navegador web moderno** con conexión a internet.
- Los pagos, en el estado actual, se procesan de forma **simulada** (no hay
  pasarela de pago real integrada todavía).
- Los precios y montos se expresan en **pesos uruguayos (UYU)**.
- La agenda de eventos y el alta de estadios la provee el **administrador**; sin
  esa carga inicial, el catálogo de oferta es limitado.

### 2.3 Restricciones del estado actual
- **Persistencia local:** la información de cuentas, sesiones y reservas se
  guarda en el **dispositivo/navegador del usuario**, no en un servidor central.
  En consecuencia, los datos **no se comparten entre dispositivos** ni se
  respaldan automáticamente.
- **Autenticación de demostración:** el inicio de sesión actual funciona en modo
  demo (ver RN-12); el registro de nuevas cuentas sí valida y persiste datos.
- Estas restricciones son del estado actual; la sección 9 describe la evolución
  esperada hacia un backend real.

---

## 3. Requerimientos funcionales

### 3.1 Generales y de navegación
- **RF-01** El sistema debe ofrecer una página de inicio con accesos a explorar
  **eventos** (agenda) y **palcos** (catálogo / alquiler por temporada).
- **RF-02** El sistema debe permitir navegar entre todas las secciones sin
  recargar la página, manteniendo direcciones (URLs) propias para cada vista de
  modo que puedan compartirse o recargarse.
- **RF-03** El sistema debe ofrecer **dos temas visuales** (uno oscuro,
  "Palco · noche", y uno claro, "Cancha · día") conmutables por el usuario.
- **RF-04** El sistema debe **adaptarse a pantallas móviles**: en pantallas
  angostas, la navegación principal debe presentarse como una barra inferior fija.

### 3.2 Exploración de eventos (agenda)
- **RF-05** El sistema debe mostrar la **agenda de eventos** (partidos y shows)
  con su fecha, hora, estadio, competencia y rival/artista.
- **RF-06** Un evento puede tener **una o varias funciones** (fecha + hora). El
  sistema debe permitir al hincha **elegir la función** antes de ver palcos.
- **RF-07** El sistema debe permitir **filtrar** la agenda (por estadio, tipo,
  precio, etc.) y mostrar imágenes/afiches del evento cuando existan.
- **RF-08** Al elegir un evento (y función), el sistema debe mostrar **los palcos
  con disponibilidad** para esa función.

### 3.3 Exploración de palcos (catálogo)
- **RF-09** El sistema debe mostrar un **catálogo de palcos** con su título,
  estadio, calificación, cantidad de asientos, estacionamiento y **precio
  "desde"** (la modalidad activa más económica).
- **RF-10** El sistema debe permitir **buscar y filtrar** palcos por texto
  (título, sector, estadio, dueño), por **estadio** (selección múltiple), por
  **modalidad**, por **estacionamiento**, por **mínimo de asientos** y por
  **rango de precio**.
- **RF-11** El sistema debe permitir **ordenar** el catálogo por relevancia,
  precio, cantidad de asientos o calificación.
- **RF-12** El catálogo debe mostrar **únicamente palcos disponibles al público**
  (ver RN-03).

### 3.4 Detalle del palco y selección
- **RF-13** El detalle de un palco debe mostrar fotos, **ubicación en el mapa del
  estadio**, comodidades, calificación y las **modalidades ofrecidas** con sus
  precios.
- **RF-14** El sistema debe permitir elegir la **modalidad** (palco entero,
  asiento anual o asiento por evento) entre las que el palco tenga activas.
- **RF-15** Para las modalidades por asiento, el sistema debe mostrar un **mapa de
  butacas** indicando cuáles están **disponibles** y cuáles **ocupadas**, y
  permitir seleccionar una o más butacas disponibles.
- **RF-16** Para la modalidad por evento, la disponibilidad de butacas debe
  corresponder a la **función específica** seleccionada.
- **RF-17** Para la modalidad "palco entero", no se seleccionan butacas
  individuales: se alquila el palco completo.
- **RF-18** El sistema debe calcular y mostrar el **subtotal** de la selección
  (precio × cantidad) antes de agregar al carrito.

### 3.5 Carrito y reserva
- **RF-19** El sistema debe permitir agregar reservas a un **carrito**, ver su
  contenido y **eliminar** ítems.
- **RF-20** El sistema debe impedir agregar una reserva por asiento sin al menos
  una butaca seleccionada.
- **RF-21** El carrito debe mostrar **subtotal, comisión (RN-01) y total**.
- **RF-22** Para confirmar el pago, el usuario **debe estar identificado**; si no
  lo está, el sistema debe solicitar ingreso/registro y **retomar el pago**
  automáticamente al completarlo.
- **RF-23** Al confirmar, el sistema debe generar una **reserva con un código
  único** y mostrar una **confirmación con un QR** de acceso.
- **RF-24** La reserva confirmada debe quedar registrada en el **historial** del
  cliente.

### 3.6 Botana (comida y bebida)
- **RF-25** El sistema debe permitir armar un **pedido de comida y bebida** a
  partir de un menú categorizado, agregando/quitando unidades y mostrando el
  **total del pedido**.
- **RF-26** El cliente debe poder **incluir snacks al momento de reservar el
  palco**: se eligen junto con la reserva y se **pagan en el mismo cobro** (un
  único total: palco + snacks iniciales).
- **RF-27** Una vez hecha la reserva, el cliente debe poder **seguir agregando
  snacks** en **pedidos posteriores**, cada uno con su **propio cobro (checkout
  separado)**. Todo pedido de botana queda **asociado a la reserva** y finaliza
  con una confirmación de "pedido listo".
- **RF-27b** Los snacks (iniciales o posteriores) **no pagan la comisión de
  plataforma (RN-01)** ni integran el payout al palquista (RN-02): son un
  **ingreso aparte** (ver RN-15).

### 3.7 Cuentas y perfil
- **RF-28** El sistema debe permitir **registrarse** con nombre, email y
  contraseña, y **validar** los datos (ver RN-10).
- **RF-29** El sistema debe permitir **iniciar y cerrar sesión**.
- **RF-30** El usuario debe poder **editar su perfil** (datos personales y de
  contacto) con validación.
- **RF-31** El usuario debe poder **cargar y quitar una foto de perfil**.
- **RF-32** El usuario debe poder gestionar **preferencias**: notificaciones
  (email, SMS, push, promociones), estadio favorito e idioma.
- **RF-33** El usuario debe poder consultar su **historial de compras**.

### 3.8 Palquista — publicación y gestión
- **RF-34** El sistema debe ofrecer un **asistente de publicación guiado** que
  recoja, en orden: país, estadio, ubicación en el plano, cantidad de asientos,
  estacionamiento, comodidades, fotos, co-propietarios, datos de cobro y
  documentación, y precios por modalidad.
- **RF-35** El asistente debe **validar cada paso** antes de avanzar (ver RN-06).
- **RF-36** Todo palco publicado debe ingresar en estado **pendiente de
  verificación** (ver RN-04) y no ser visible al público hasta su aprobación.
- **RF-37** El palquista debe poder **editar** un palco existente; toda edición
  relevante lo **reenvía a verificación** (RN-05).
- **RF-38** El palquista debe poder **pausar y reactivar** sus publicaciones,
  salvo cuando el palco esté alquilado (RN-07).
- **RF-39** El palquista debe poder **ver estadísticas** de sus palcos:
  recaudación, ocupación, entradas vendidas por evento, visitas y conversión, con
  desgloses por modalidad y evento y evolución temporal.
- **RF-40** Cuando un palco sea rechazado, el palquista debe ver **qué campos** se
  observaron y por qué, poder **aclararlos/corregirlos** y **reenviar** a revisión.

### 3.9 Administrador — operación del marketplace
- **RF-41** El administrador debe poder **crear y editar eventos**, incluyendo
  eventos con **una o varias funciones** (fecha + hora) e imágenes opcionales.
- **RF-42** Los eventos creados/editados deben reflejarse **inmediatamente** del
  lado del hincha.
- **RF-43** El administrador debe poder **crear y editar estadios** (datos
  generales y un plano/foto opcional).
- **RF-44** El administrador debe poder **listar todos los palcos** con su estado,
  dueño, precio y ocupación.
- **RF-45** El administrador debe poder **verificar palcos pendientes**:
  **aprobar** (publicar) o **rechazar** marcando campos puntuales con su motivo
  (ver RN-08, RN-09).
- **RF-46** El administrador debe contar con un **CRM de clientes** con gasto
  total, cantidad de reservas, puntos e historial por cuenta.
- **RF-47** El administrador debe poder consultar el **listado completo de
  reservas**.
- **RF-48** El administrador debe contar con un **panel de finanzas**: ingresos
  brutos (GMV), comisión, payout a palquistas e ingreso por botana, con
  desgloses por estadio y por mes.
- **RF-49** El administrador debe contar con un **tablero (dashboard)** que reúna
  los indicadores clave del negocio.
- **RF-50** El acceso al panel de administración debe estar **restringido** a
  cuentas con atribución de administrador (RN-13).

---

## 4. Reglas de negocio

- **RN-01 (Comisión):** Sobre el subtotal de cada reserva, el sistema debe
  aplicar una **comisión de plataforma del 4 %**. El total que paga el hincha es
  *subtotal + comisión*.
- **RN-02 (Payout):** El monto a transferir al palquista por una reserva es el
  **subtotal menos la comisión** (la botana se contabiliza por separado).
- **RN-03 (Visibilidad del catálogo):** Solo los palcos en estado **publicado** o
  **alquilado** son visibles al público. Los palcos **pendiente**, **rechazado**
  o **pausado** no aparecen en búsquedas ni catálogo.
- **RN-04 (Verificación previa):** Todo palco **nuevo** debe entrar como
  **pendiente** y requiere aprobación del administrador antes de publicarse.
- **RN-05 (Reverificación por edición):** Toda **edición** relevante de un palco
  lo devuelve a **pendiente** y lo retira del catálogo hasta su nueva aprobación.
  La edición debe **preservar** la identidad del palco, su reputación y las
  reservas ya existentes.
- **RN-06 (Completitud de la publicación):** El asistente debe exigir como mínimo:
  un estadio válido, la ubicación marcada en el plano, al menos **1 asiento**, al
  menos **1 comodidad**, al menos **3 fotos**, datos de cobro completos con sus
  documentos de respaldo, datos válidos de cada co-propietario declarado y al
  menos **una modalidad activa** con precio.
- **RN-07 (Pausa restringida):** Un palco en estado **alquilado** no puede
  pausarse.
- **RN-08 (Aprobación):** Al aprobar, el palco pasa a **publicado** y queda
  disponible para alquilar.
- **RN-09 (Rechazo justificado):** Para rechazar, el administrador debe indicar
  **al menos un motivo general o un campo observado**, y **cada campo observado
  debe llevar su motivo**. El palco pasa a **rechazado** y se notifica al dueño.
- **RN-10 (Validación de registro):** El registro debe exigir nombre (mínimo 2
  caracteres), email con formato válido y contraseña (mínimo 4 caracteres), y
  **rechazar** emails ya registrados.
- **RN-11 (Disponibilidad por modalidad):** La ocupación de butacas se gestiona
  por modalidad: para **asiento anual**, a nivel temporada; para **asiento por
  evento**, por **función** (fecha + hora). Una butaca puede estar libre para una
  función y ocupada para otra.
- **RN-12 (Sesión en modo demo):** En el estado actual, el inicio de sesión
  ingresa a la cuenta de demostración. Esta regla es transitoria y se reemplaza al
  integrar autenticación real (sección 9).
- **RN-13 (Acceso administrativo):** Las funciones de administración solo deben
  estar disponibles para cuentas con atribución de administrador; cualquier otro
  acceso debe ser denegado.
- **RN-14 (Moneda):** Todos los montos deben expresarse en **pesos uruguayos** con
  formato local (ej.: "$U 1.180.000").
- **RN-15 (Cobro de la botana):** Los snacks se cobran **junto con la reserva**
  cuando se eligen al reservar (un único total), o en **pedidos posteriores con
  cobro independiente**, siempre asociados a la reserva. El importe de botana
  **no genera comisión (RN-01) ni payout (RN-02)**: es ingreso aparte de la
  plataforma.

---

## 5. Requerimientos no funcionales

### 5.1 Usabilidad
- **RNF-01** La aplicación debe ser **autoexplicativa**: reservar debe ser tan
  simple como comprar una entrada en línea.
- **RNF-02** Toda acción que falle una validación debe informar al usuario con un
  **mensaje claro** indicando qué corregir.
- **RNF-03** Las acciones relevantes (agregar al carrito, pagar, guardar) deben
  dar **retroalimentación inmediata** (confirmaciones, avisos).
- **RNF-04** El idioma de la interfaz es **español rioplatense**.

### 5.2 Compatibilidad y accesibilidad
- **RNF-05** La aplicación debe funcionar en **navegadores web modernos** de
  escritorio y móvil.
- **RNF-06** El diseño debe ser **responsive** (escritorio, tablet y móvil).
- **RNF-07** Debe ofrecer **tema claro y oscuro** con buen contraste en ambos.

### 5.3 Rendimiento
- **RNF-08** La carga inicial de catálogos (eventos, palcos, estadios, etc.) debe
  realizarse de forma **ágil**, sin bloquear la interacción.
- **RNF-09** La navegación entre vistas debe ser **inmediata** (sin recargas de
  página completas).

### 5.4 Confiabilidad y disponibilidad de datos
- **RNF-10** La información del usuario (cuenta, sesión, reservas) debe
  **persistir entre sesiones** del mismo dispositivo.
- **RNF-11** Las fallas al guardar datos locales (almacenamiento no disponible,
  cuota llena, modo privado) **no deben interrumpir** el uso de la aplicación.
- **RNF-12** *(Estado objetivo)* Con backend, los datos deben estar **centralizados,
  respaldados y disponibles entre dispositivos** (ver sección 9).

### 5.5 Seguridad y privacidad
- **RNF-13** El acceso a funciones de administración debe estar **controlado por
  rol** (RN-13).
- **RNF-14** Los datos sensibles del palquista (documentos de identidad, título de
  propiedad, datos bancarios) deben tratarse con **confidencialidad** y usarse
  únicamente para verificación y pago.
- **RNF-15** *(Estado objetivo)* Las credenciales deben gestionarse de forma
  segura (sin almacenarse en texto plano) cuando exista autenticación real.

### 5.6 Mantenibilidad y evolución
- **RNF-16** El sistema debe estar preparado para **sustituir el origen de datos
  local por un backend real** con impacto acotado y sin rediseñar la experiencia.
- **RNF-17** Las reglas de negocio (comisión, estados, validaciones) deben estar
  centralizadas para poder ajustarse de forma consistente.

### 5.7 Internacionalización (futuro)
- **RNF-18** *(Deseable)* La estructura de país en eventos, estadios y palcos debe
  permitir, a futuro, operar en **más de un país** y eventualmente otras monedas
  e idiomas.

---

## 6. Requerimientos de datos

- **RD-01** El sistema debe registrar **estadios** con: nombre, abreviatura,
  ciudad, país, capacidad, año, superficie, niveles, dirección, si es techado y
  un plano/foto opcional.
- **RD-02** El sistema debe registrar **eventos** con: estadio, país, tipo
  (fútbol/basketball/show), competencia, instancia, rival/artista, etiqueta,
  observaciones, imágenes y **una o varias funciones** (fecha + hora).
- **RD-03** El sistema debe registrar **palcos** con: estadio y país, título,
  sector, ubicación en el plano, cantidad de asientos, estacionamiento,
  comodidades, fotos, dueño, calificación, co-propietarios, datos de cobro,
  **modalidades** (con activación y precio) y **estado**.
- **RD-04** Para cada palco, el sistema debe registrar la **ocupación de butacas**
  por modalidad (anual y por función).
- **RD-05** El sistema debe registrar **cuentas de usuario** con: nombre, email,
  teléfono, documento, datos de contacto, preferencias, puntos, atribución de
  administrador y, opcionalmente, foto, medio de pago y datos de facturación.
- **RD-06** El sistema debe registrar **reservas (órdenes)** con: código,
  cliente, ítems reservados, subtotal, comisión, descuento, total, fecha, datos
  de contacto y los **snacks iniciales** incluidos en el cobro de la reserva
  (con su total).
- **RD-06b** El sistema debe registrar las **órdenes de snacks posteriores**:
  código, reserva asociada, cliente, ítems, total, fecha y su cobro propio.
- **RD-07** El sistema debe registrar el **catálogo de botana**: ítems con
  categoría, nombre, precio y descripción.
- **RD-08** Para cada palco rechazado, el sistema debe conservar el **detalle de
  la verificación**: motivo general, campos observados con su razón y las
  respuestas del palquista.

---

## 7. Requerimientos de interfaz

- **RI-01** La aplicación debe presentar un **encabezado** persistente con la
  marca, navegación principal, conmutador de tema y acceso a la cuenta/carrito.
- **RI-02** En móvil, la navegación principal debe ofrecerse como **barra inferior
  fija**.
- **RI-03** El detalle de palco debe incluir un **mapa visual del estadio** con la
  ubicación del palco y un **mapa de butacas** interactivo.
- **RI-04** Los paneles de estadísticas y finanzas deben presentar la información
  con **indicadores y gráficos** comprensibles de un vistazo.
- **RI-05** Los formularios (publicación, alta de evento/estadio, perfil) deben
  guiar con **pasos, validaciones y mensajes** claros.
- **RI-06** *(Estado objetivo)* El sistema debe poder integrarse con una **pasarela
  de pago** y servicios externos de notificación cuando se incorporen.

---

## 8. Fuera de alcance (estado actual)

- Procesamiento **real** de pagos y conciliación bancaria.
- Transferencias automáticas de payout a los palquistas.
- Notificaciones reales por email/SMS/push (las preferencias se gestionan, pero
  el envío no está integrado).
- Aplicaciones móviles nativas (la solución es web responsive).
- Operación multimoneda/multilenguaje (estructura preparada, no habilitada).

---

## 9. Evolución esperada (de demo a producción)

El sistema fue concebido para **migrar de un funcionamiento local a uno con
servidor** sin rehacer la experiencia. Los hitos esperados:

1. **Backend central:** reemplazar el almacenamiento local por servicios de
   servidor, habilitando datos compartidos entre dispositivos, respaldo y
   consistencia (cubre RNF-12).
2. **Autenticación real:** sustituir el modo demo por registro/login seguros
   (reemplaza RN-12, cubre RNF-15).
3. **Pagos reales:** integrar una pasarela y la gestión de payouts (cubre RI-06).
4. **Notificaciones:** activar el envío efectivo según las preferencias del
   usuario.
5. **Expansión:** habilitar operación en más países, monedas e idiomas (RNF-18).

---

## 10. Trazabilidad (resumen)

| Necesidad de negocio | Requerimientos asociados |
|----------------------|--------------------------|
| Dar vidriera y herramientas al dueño | RF-34 a RF-40, RN-04 a RN-09 |
| Dar acceso flexible al hincha | RF-05 a RF-27, RN-01, RN-11 |
| Generar confianza (calidad) | RF-36, RF-45, RN-03 a RN-09, RNF-13/14 |
| Operar y controlar el marketplace | RF-41 a RF-50, RN-13 |
| Monetización | RN-01, RN-02, RF-48 |
| Escalabilidad del producto | RNF-16, RNF-18, sección 9 |
```
