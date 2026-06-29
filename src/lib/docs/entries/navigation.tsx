import { useState } from 'react'
import type { ReactNode } from 'react'
import type { DocEntry } from '../types'
import {
  Tabs, Breadcrumb, Pagination, Stepper, Timeline, NavSidebar, Topbar, Sidebar,
} from '../../index'
import type { NavGroup } from '../../index'
import {
  HomeIcon, Squares2X2Icon, ChartBarIcon, UserIcon, Cog6ToothIcon,
  BellIcon, MagnifyingGlassIcon, ArrowLeftIcon, Bars3Icon, InboxIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline'

// ─── Stateful demo: Tabs ────────────────────────────────────────────────────

function TabsUnderlineDemo() {
  const [active, setActive] = useState('overview')
  return (
    <Tabs
      variant="underline"
      active={active}
      onChange={setActive}
      tabs={[
        { key: 'overview', label: 'Vista general' },
        { key: 'stats',    label: 'Estadísticas' },
        { key: 'history',  label: 'Historial' },
      ]}
    />
  )
}

function TabsPillDemo() {
  const [active, setActive] = useState('monthly')
  return (
    <Tabs
      variant="pill"
      active={active}
      onChange={setActive}
      tabs={[
        { key: 'daily',   label: 'Día' },
        { key: 'weekly',  label: 'Semana' },
        { key: 'monthly', label: 'Mes' },
        { key: 'yearly',  label: 'Año' },
      ]}
    />
  )
}

function TabsManyDemo() {
  const [active, setActive] = useState('a')
  return (
    <Tabs
      variant="underline"
      active={active}
      onChange={setActive}
      tabs={[
        { key: 'a', label: 'Perfil' },
        { key: 'b', label: 'Seguridad' },
        { key: 'c', label: 'Notificaciones' },
        { key: 'd', label: 'Facturación' },
        { key: 'e', label: 'API' },
      ]}
    />
  )
}

function TabsPillControlledDemo() {
  const [active, setActive] = useState('list')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <Tabs
        variant="pill"
        active={active}
        onChange={setActive}
        tabs={[
          { key: 'list',  label: 'Lista' },
          { key: 'grid',  label: 'Grilla' },
          { key: 'map',   label: 'Mapa' },
        ]}
      />
      <div style={{
        padding: '12px 16px', borderRadius: '10px',
        background: 'var(--muted,#1F2530)', color: 'var(--muted-foreground,#9AA6B2)',
        fontFamily: 'Archivo', fontSize: '13.5px',
      }}>
        Vista activa: <strong style={{ color: 'var(--primary,#C9A24B)' }}>{active}</strong>
      </div>
    </div>
  )
}

// ─── Stateful demo: Pagination ──────────────────────────────────────────────

function PaginationBasicDemo() {
  const [page, setPage] = useState(1)
  return <Pagination page={page} total={10} onChange={setPage} />
}

function PaginationMidDemo() {
  const [page, setPage] = useState(6)
  return <Pagination page={page} total={20} onChange={setPage} />
}

function PaginationSmallDemo() {
  const [page, setPage] = useState(3)
  return <Pagination page={page} total={5} onChange={setPage} />
}

function PaginationLargeDemo() {
  const [page, setPage] = useState(1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <Pagination page={page} total={50} onChange={setPage} />
      <span style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--subtle-foreground,#6B7480)' }}>
        Página {page} de 50
      </span>
    </div>
  )
}

// ─── Stateful demo: NavSidebar ───────────────────────────────────────────────

function NavSidebarBasicDemo() {
  const [active, setActive] = useState('dashboard')
  return (
    <div style={{
      width: '100%', maxWidth: '260px', height: '300px',
      border: '1px solid var(--border,rgba(255,255,255,.1))',
      borderRadius: '12px', overflow: 'hidden', display: 'flex',
    }}>
      <NavSidebar
        active={active}
        onSelect={setActive}
        items={[
          { key: 'dashboard', label: 'Dashboard',    icon: <Squares2X2Icon /> },
          { key: 'stats',     label: 'Estadísticas', icon: <ChartBarIcon />   },
          { key: 'inbox',     label: 'Mensajes',     icon: <InboxIcon />      },
          { key: 'profile',   label: 'Perfil',       icon: <UserIcon />       },
          { key: 'settings',  label: 'Ajustes',      icon: <Cog6ToothIcon />  },
        ]}
      />
    </div>
  )
}

function NavSidebarWithHeaderFooterDemo() {
  const [active, setActive] = useState('home')
  return (
    <div style={{
      width: '100%', maxWidth: '260px', height: '320px',
      border: '1px solid var(--border,rgba(255,255,255,.1))',
      borderRadius: '12px', overflow: 'hidden', display: 'flex',
    }}>
      <NavSidebar
        active={active}
        onSelect={setActive}
        header={
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            fontFamily: 'Archivo', fontWeight: 900, fontSize: '16px',
            color: 'var(--primary,#C9A24B)',
          }}>
            <HomeIcon style={{ width: 20, height: 20 }} />
            Palqueate
          </div>
        }
        footer={
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)',
          }}>
            <UserIcon style={{ width: 16, height: 16 }} />
            Usuario
          </div>
        }
        items={[
          { key: 'home',    label: 'Inicio',    icon: <HomeIcon />            },
          { key: 'explore', label: 'Explorar',  icon: <MagnifyingGlassIcon /> },
          { key: 'saved',   label: 'Guardados', icon: <BookmarkIcon />        },
          { key: 'notifs',  label: 'Alertas',   icon: <BellIcon />            },
        ]}
      />
    </div>
  )
}

function NavSidebarBadgeDemo() {
  const [active, setActive] = useState('inbox')
  return (
    <div style={{
      width: '100%', maxWidth: '260px', height: '220px',
      border: '1px solid var(--border,rgba(255,255,255,.1))',
      borderRadius: '12px', overflow: 'hidden', display: 'flex',
    }}>
      <NavSidebar
        active={active}
        onSelect={setActive}
        items={[
          {
            key: 'inbox', label: 'Mensajes', icon: <InboxIcon />,
            badge: <span style={{ background: 'var(--primary,#C9A24B)', color: 'var(--primary-foreground,#1A1407)', borderRadius: '10px', padding: '1px 7px', fontFamily: 'Archivo', fontWeight: 800, fontSize: '11px' }}>4</span>,
          },
          {
            key: 'notifs', label: 'Notificaciones', icon: <BellIcon />,
            badge: <span style={{ background: '#E05252', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontFamily: 'Archivo', fontWeight: 800, fontSize: '11px' }}>12</span>,
          },
          { key: 'settings', label: 'Ajustes', icon: <Cog6ToothIcon /> },
        ]}
      />
    </div>
  )
}

function NavSidebarNoIconsDemo() {
  const [active, setActive] = useState('general')
  return (
    <div style={{
      width: '100%', maxWidth: '220px', height: '240px',
      border: '1px solid var(--border,rgba(255,255,255,.1))',
      borderRadius: '12px', overflow: 'hidden', display: 'flex',
    }}>
      <NavSidebar
        active={active}
        onSelect={setActive}
        items={[
          { key: 'general',      label: 'General'       },
          { key: 'account',      label: 'Cuenta'        },
          { key: 'privacy',      label: 'Privacidad'    },
          { key: 'billing',      label: 'Facturación'   },
          { key: 'integrations', label: 'Integraciones' },
        ]}
      />
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────

const tabsEntry: DocEntry = {
  slug: 'tabs',
  name: 'Tabs',
  category: 'Navegación',
  description: 'Pestañas horizontales controladas. Dos variantes: underline (navegación de secciones) y pill (selector compacto de vista).',
  importLine: "import { Tabs } from './lib'",
  props: [
    { name: 'tabs',    type: '{ key: string; label: string }[]', default: '[]',         description: 'Lista de pestañas. Cada ítem necesita una key única y un label visible.' },
    { name: 'active',  type: 'string',                           default: "''",          description: 'Key de la pestaña actualmente seleccionada.' },
    { name: 'variant', type: "'underline' | 'pill'",             default: "'underline'", description: 'Estilo visual. underline dibuja un borde inferior; pill usa fondo opaco redondeado.' },
  ],
  events: [
    { name: 'onChange', type: '(key: string) => void', description: 'Se invoca cuando el usuario hace clic en una pestaña, pasando la key correspondiente.' },
  ],
  notes: [
    'El componente es completamente controlado: active + onChange son responsabilidad del padre.',
    'La variante pill es ideal para toggles de vista (grilla/lista/mapa); underline para secciones de contenido.',
    'No incluye panel de contenido — es solo la barra de pestañas.',
  ],
  examples: [
    {
      title: 'Underline — básico',
      description: 'La variante por defecto. Ideal para navegación de secciones de contenido.',
      node: <TabsUnderlineDemo />,
      code: `const [active, setActive] = useState('overview')

<Tabs
  variant="underline"
  active={active}
  onChange={setActive}
  tabs={[
    { key: 'overview', label: 'Vista general' },
    { key: 'stats',    label: 'Estadísticas' },
    { key: 'history',  label: 'Historial' },
  ]}
/>`,
    },
    {
      title: 'Pill — selector de período',
      description: 'Variante compacta, perfecta para alternar vistas o filtros.',
      node: <TabsPillDemo />,
      code: `const [active, setActive] = useState('monthly')

<Tabs
  variant="pill"
  active={active}
  onChange={setActive}
  tabs={[
    { key: 'daily',   label: 'Día' },
    { key: 'weekly',  label: 'Semana' },
    { key: 'monthly', label: 'Mes' },
    { key: 'yearly',  label: 'Año' },
  ]}
/>`,
    },
    {
      title: 'Underline — múltiples pestañas',
      description: 'Funciona con cualquier cantidad de ítems; el scroll horizontal sale automáticamente.',
      node: <TabsManyDemo />,
    },
    {
      title: 'Pill controlado con panel reactivo',
      description: 'El panel de contenido lo maneja el padre según el valor de active devuelto.',
      node: <TabsPillControlledDemo />,
      code: `const [active, setActive] = useState('list')

<Tabs variant="pill" active={active} onChange={setActive}
  tabs={[
    { key: 'list', label: 'Lista' },
    { key: 'grid', label: 'Grilla' },
    { key: 'map',  label: 'Mapa' },
  ]}
/>
{active === 'list' && <ListView />}
{active === 'grid' && <GridView />}`,
    },
  ],
}

const breadcrumbEntry: DocEntry = {
  slug: 'breadcrumb',
  name: 'Breadcrumb',
  category: 'Navegación',
  description: 'Ruta de navegación jerárquica. El último ítem es el actual (no clickeable); los anteriores son clickeables si se pasa onClick.',
  importLine: "import { Breadcrumb } from './lib'",
  props: [
    {
      name: 'items',
      type: '{ label: string; onClick?: () => void }[]',
      default: '[]',
      description: 'Lista de crumbs en orden. El último se renderiza como actual (negrita, color primario); los anteriores actúan como vínculos si tienen onClick.',
    },
  ],
  notes: [
    'onClick es opcional por ítem — si se omite, el crumb se muestra como texto pero no es clickeable.',
    'El separador es una flecha SVG integrada; no se expone como prop.',
    'El último ítem nunca dispara onClick aunque se defina.',
  ],
  examples: [
    {
      title: 'Tres niveles',
      description: 'Caso más común: inicio → sección → página actual.',
      node: (
        <Breadcrumb items={[
          { label: 'Inicio',    onClick: () => {} },
          { label: 'Productos', onClick: () => {} },
          { label: 'Zapatillas deportivas' },
        ]} />
      ),
      code: `<Breadcrumb items={[
  { label: 'Inicio',    onClick: () => router.push('/') },
  { label: 'Productos', onClick: () => router.push('/productos') },
  { label: 'Zapatillas deportivas' },
]} />`,
    },
    {
      title: 'Dos niveles',
      node: (
        <Breadcrumb items={[
          { label: 'Dashboard', onClick: () => {} },
          { label: 'Configuración' },
        ]} />
      ),
    },
    {
      title: 'Solo un ítem (página raíz)',
      description: 'Cuando no hay jerarquía, un único ítem actúa como título de ruta.',
      node: (
        <Breadcrumb items={[{ label: 'Inicio' }]} />
      ),
    },
    {
      title: 'Ruta profunda — cinco niveles',
      description: 'El componente se hace wrappeable automáticamente con flexWrap.',
      node: (
        <Breadcrumb items={[
          { label: 'Admin',    onClick: () => {} },
          { label: 'Usuarios', onClick: () => {} },
          { label: 'Equipos',  onClick: () => {} },
          { label: 'Frontend', onClick: () => {} },
          { label: 'Joaquín G.' },
        ]} />
      ),
    },
    {
      title: 'Sin onClick en ítems intermedios',
      description: 'Los crumbs sin onClick se muestran como texto puro sin cursor pointer.',
      node: (
        <Breadcrumb items={[
          { label: 'Docs' },
          { label: 'Componentes' },
          { label: 'Breadcrumb' },
        ]} />
      ),
    },
  ],
}

const paginationEntry: DocEntry = {
  slug: 'pagination',
  name: 'Pagination',
  category: 'Navegación',
  description: 'Control de paginación controlado con flechas prev/next y páginas numeradas. Genera ellipsis automáticamente para listas largas.',
  importLine: "import { Pagination } from './lib'",
  props: [
    { name: 'page',  type: 'number', default: '1', description: 'Página actualmente seleccionada (1-based).' },
    { name: 'total', type: 'number', default: '1', description: 'Total de páginas disponibles.' },
  ],
  events: [
    { name: 'onChange', type: '(page: number) => void', description: 'Se invoca al hacer clic en un número de página o en las flechas prev/next.' },
  ],
  notes: [
    'Las flechas prev/next se deshabilitan automáticamente en los bordes (page=1 o page=total).',
    'Para 7 o menos páginas totales no se generan ellipsis — se muestran todas.',
    'El componente es completamente controlado — page debe actualizarse desde el padre.',
  ],
  examples: [
    {
      title: 'Básico — 10 páginas',
      node: <PaginationBasicDemo />,
      code: `const [page, setPage] = useState(1)

<Pagination page={page} total={10} onChange={setPage} />`,
    },
    {
      title: 'Con ellipsis — desde el medio',
      description: 'Página 6 de 20: se generan ellipsis a ambos lados del rango visible.',
      node: <PaginationMidDemo />,
      code: `const [page, setPage] = useState(6)
<Pagination page={page} total={20} onChange={setPage} />`,
    },
    {
      title: 'Lista corta — sin ellipsis',
      description: 'Hasta 7 páginas se muestran todas sin comprimir.',
      node: <PaginationSmallDemo />,
    },
    {
      title: 'Lista grande — 50 páginas',
      description: 'El algoritmo comprime el rango al mínimo legible independientemente del total.',
      node: <PaginationLargeDemo />,
      code: `const [page, setPage] = useState(1)
<Pagination page={page} total={50} onChange={setPage} />`,
    },
  ],
}

const stepperEntry: DocEntry = {
  slug: 'stepper',
  name: 'Stepper',
  category: 'Navegación',
  description: 'Indicador de progreso horizontal para flujos de varios pasos (checkout, onboarding, wizards). Los pasos previos muestran un checkmark; el activo, un anillo brand.',
  importLine: "import { Stepper } from './lib'",
  props: [
    { name: 'steps',   type: '{ label: string }[]', default: '[]', description: 'Lista de pasos en orden. Cada ítem solo necesita un label.' },
    { name: 'current', type: 'number',               default: '0',  description: 'Índice del paso activo (0-based). Los índices menores quedan marcados como done con checkmark.' },
  ],
  notes: [
    'current es 0-based: current=0 es el primer paso, current=steps.length-1 es el último.',
    'No tiene estado interno — el padre controla current.',
    'El conector entre pasos se pinta con color brand cuando el paso izquierdo está done.',
    'Pasar current >= steps.length marca todos los pasos como done (flujo completado).',
  ],
  examples: [
    {
      title: 'Primer paso activo',
      description: 'current=0: solo el primer paso está activo, el resto pendiente.',
      node: (
        <Stepper
          current={0}
          steps={[
            { label: 'Datos personales' },
            { label: 'Envío' },
            { label: 'Pago' },
            { label: 'Confirmación' },
          ]}
        />
      ),
      code: `<Stepper
  current={0}
  steps={[
    { label: 'Datos personales' },
    { label: 'Envío' },
    { label: 'Pago' },
    { label: 'Confirmación' },
  ]}
/>`,
    },
    {
      title: 'Paso intermedio',
      description: 'current=2: los dos primeros están done (checkmark), el tercero activo.',
      node: (
        <Stepper
          current={2}
          steps={[
            { label: 'Cuenta' },
            { label: 'Equipo' },
            { label: 'Plan' },
            { label: 'Pago' },
          ]}
        />
      ),
    },
    {
      title: 'Último paso (resumen)',
      description: 'Todos los pasos previos con checkmark, el último activo.',
      node: (
        <Stepper
          current={3}
          steps={[
            { label: 'Datos' },
            { label: 'Dirección' },
            { label: 'Pago' },
            { label: 'Resumen' },
          ]}
        />
      ),
    },
    {
      title: 'Todos completados',
      description: 'current >= steps.length — todos los pasos con checkmark.',
      node: (
        <Stepper
          current={4}
          steps={[
            { label: 'Paso 1' },
            { label: 'Paso 2' },
            { label: 'Paso 3' },
            { label: 'Paso 4' },
          ]}
        />
      ),
    },
    {
      title: 'Dos pasos — flujo mínimo',
      description: 'Mínimo viable para flujos simples de confirmación.',
      node: (
        <Stepper
          current={0}
          steps={[
            { label: 'Verificar' },
            { label: 'Confirmar' },
          ]}
        />
      ),
    },
  ],
}

const timelineEntry: DocEntry = {
  slug: 'timeline',
  name: 'Timeline',
  category: 'Navegación',
  description: 'Rastro de eventos vertical con nodo de estado por ítem. Ideal para historial de pedidos, estados de reserva y actividad de usuario.',
  importLine: "import { Timeline } from './lib'",
  props: [
    {
      name: 'items',
      type: "{ title: ReactNode; meta?: string; body?: ReactNode; state?: 'done' | 'active' | 'pending' }[]",
      default: '[]',
      description: "Lista de eventos. state controla el color del nodo: 'done' rellena con brand, 'active' dibuja anillo con halo, 'pending'/undefined usa muted. meta se muestra en Space Mono como timestamp.",
    },
  ],
  notes: [
    '"done" rellena el nodo con color brand. "active" dibuja un anillo brand con halo difuminado. Sin state o "pending" usa color muted.',
    'title y body aceptan ReactNode — se puede pasar texto, badges o cualquier elemento.',
    'meta se renderiza en Space Mono a 11px, ideal para fechas y horas.',
  ],
  examples: [
    {
      title: 'Estados mixtos — historial de pedido',
      description: 'Combinación de done, active y pending en un flujo real.',
      node: (
        <Timeline items={[
          { title: 'Pedido confirmado',  meta: 'hace 2 h',    state: 'done',    body: 'Pago acreditado correctamente.' },
          { title: 'En preparación',     meta: 'hace 45 min', state: 'done'                                           },
          { title: 'Enviado',            meta: 'hace 10 min', state: 'active',  body: 'Tu paquete está en camino.'    },
          { title: 'Entrega estimada',   meta: 'mañana 14:00', state: 'pending'                                       },
        ]} />
      ),
      code: `<Timeline items={[
  { title: 'Pedido confirmado', meta: 'hace 2 h',    state: 'done',    body: 'Pago acreditado.' },
  { title: 'En preparación',   meta: 'hace 45 min', state: 'done'                              },
  { title: 'Enviado',          meta: 'hace 10 min', state: 'active',  body: 'En camino.'       },
  { title: 'Entrega estimada', meta: 'mañana 14:00', state: 'pending'                          },
]} />`,
    },
    {
      title: 'Solo done — log histórico',
      description: 'Todos los eventos completados, sin estado activo.',
      node: (
        <Timeline items={[
          { title: 'Cuenta creada',             meta: '12 jun 2024', state: 'done' },
          { title: 'Primer pago procesado',      meta: '15 jun 2024', state: 'done' },
          { title: 'Plan actualizado a Pro',     meta: '30 jun 2024', state: 'done' },
          { title: 'Miembro del equipo añadido', meta: '2 jul 2024',  state: 'done' },
        ]} />
      ),
    },
    {
      title: 'Mínimo — solo título y estado',
      description: 'Sin meta ni body, versión más compacta.',
      node: (
        <Timeline items={[
          { title: 'Iniciado',   state: 'done'    },
          { title: 'En revisión', state: 'active'  },
          { title: 'Aprobación', state: 'pending' },
          { title: 'Publicado',  state: 'pending' },
        ]} />
      ),
    },
    {
      title: 'Con body enriquecido',
      description: 'body acepta ReactNode — se puede incluir badges, links u otros elementos.',
      node: (
        <Timeline items={[
          {
            title: 'Reserva creada', meta: 'hoy 09:14', state: 'done',
            body: <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Referencia: <strong style={{ color: 'var(--primary,#C9A24B)' }}>#RES-2024-0881</strong></span>,
          },
          {
            title: 'Pago pendiente', meta: 'hoy 09:15', state: 'active',
            body: 'Esperando confirmación del procesador.',
          },
          { title: 'Confirmación final', state: 'pending' },
        ]} />
      ),
    },
    {
      title: 'Un solo ítem activo',
      description: 'El halo brand resalta el único evento en curso sin ruta anterior.',
      node: (
        <Timeline items={[
          { title: 'Procesando tu solicitud…', meta: 'ahora mismo', state: 'active', body: 'Verificando disponibilidad de sala.' },
        ]} />
      ),
    },
  ],
}

const navSidebarEntry: DocEntry = {
  slug: 'nav-sidebar',
  name: 'NavSidebar',
  category: 'Navegación',
  description: 'Rail de navegación vertical con highlight de ítem activo, slots de header y footer, badges opcionales por ítem e íconos leading.',
  importLine: "import { NavSidebar } from './lib'",
  props: [
    {
      name: 'items',
      type: '{ key: string; label: string; icon?: ReactNode; badge?: ReactNode }[]',
      default: '[]',
      description: 'Lista de ítems de navegación. icon acepta cualquier nodo (Heroicons, SVG). badge acepta cualquier nodo (spans con contadores, puntos, etc).',
    },
    { name: 'active',  type: 'string',    default: "''",  description: 'Key del ítem actualmente seleccionado. Muestra accent brand y barra lateral izquierda.' },
    { name: 'header',  type: 'ReactNode',                 description: 'Slot superior — logo, nombre de app, avatar de usuario.' },
    { name: 'footer',  type: 'ReactNode',                 description: 'Slot inferior — configuración, logout, info de versión.' },
    { name: 'width',   type: 'number',    default: '240', description: 'Ancho del rail en píxeles.' },
  ],
  events: [
    { name: 'onSelect', type: '(key: string) => void', description: 'Se invoca al hacer clic en un ítem, pasando su key.' },
  ],
  notes: [
    'El sidebar usa alignSelf: stretch — se estira al alto del contenedor padre. Envolverlo en un div con height definida es necesario en demos o layouts sin flex-parent.',
    'Los badges pueden ser cualquier nodo; el componente solo los renderiza en el trailing del ítem.',
    'Los íconos leading son escalados a 18×18px vía la clase pq-ico.',
  ],
  examples: [
    {
      title: 'Básico con íconos',
      description: 'Rail con cinco ítems y Heroicons como leading icons.',
      node: <NavSidebarBasicDemo />,
      code: `const [active, setActive] = useState('dashboard')

<NavSidebar
  active={active}
  onSelect={setActive}
  items={[
    { key: 'dashboard', label: 'Dashboard',    icon: <Squares2X2Icon /> },
    { key: 'stats',     label: 'Estadísticas', icon: <ChartBarIcon />   },
    { key: 'inbox',     label: 'Mensajes',     icon: <InboxIcon />      },
    { key: 'profile',   label: 'Perfil',       icon: <UserIcon />       },
    { key: 'settings',  label: 'Ajustes',      icon: <Cog6ToothIcon />  },
  ]}
/>`,
    },
    {
      title: 'Con header y footer',
      description: 'Slots para logo de app en la cabecera y usuario/logout al pie.',
      node: <NavSidebarWithHeaderFooterDemo />,
      code: `<NavSidebar
  active={active}
  onSelect={setActive}
  header={<Logo />}
  footer={<UserRow />}
  items={items}
/>`,
    },
    {
      title: 'Con badges numéricos',
      description: 'Los badges se posicionan automáticamente en el trailing de cada ítem.',
      node: <NavSidebarBadgeDemo />,
      code: `{
  key: 'inbox',
  label: 'Mensajes',
  icon: <InboxIcon />,
  badge: <span style={{ background: 'var(--primary,#C9A24B)', ... }}>4</span>,
}`,
    },
    {
      title: 'Sin íconos — solo texto',
      description: 'Útil para panels de configuración con secciones en texto plano.',
      node: <NavSidebarNoIconsDemo />,
      code: `<NavSidebar
  active={active}
  onSelect={setActive}
  items={[
    { key: 'general',  label: 'General'   },
    { key: 'account',  label: 'Cuenta'    },
    { key: 'privacy',  label: 'Privacidad' },
  ]}
/>`,
    },
  ],
}

const topbarEntry: DocEntry = {
  slug: 'topbar',
  name: 'Topbar',
  category: 'Navegación',
  description: 'Barra superior de app con slots left, title, center (children) y right. Sticky por defecto con efecto glass (blur + opacidad parcial).',
  importLine: "import { Topbar } from './lib'",
  props: [
    { name: 'title',    type: 'ReactNode', description: 'Título de la sección actual. Se renderiza en Archivo 900 a 17px.' },
    { name: 'left',     type: 'ReactNode', description: 'Slot izquierdo — botón de menú, flecha de retroceso, logo.' },
    { name: 'children', type: 'ReactNode', description: 'Slot central — se centra automáticamente con flex: 1. Ideal para un campo de búsqueda.' },
    { name: 'right',    type: 'ReactNode', description: 'Slot derecho — acciones, avatar, toggle de tema. Es un flex row con gap: 10px.' },
    { name: 'sticky',   type: 'boolean',   default: 'true', description: 'Cuando es true, usa position: sticky top: 0 z-index: 50.' },
  ],
  notes: [
    'El fondo usa color-mix con 88% de opacidad + backdrop-filter: blur(10px) para el efecto glass.',
    'sticky=false convierte la posición en static — útil dentro de paneles con scroll propio.',
    'El slot right acepta múltiples nodos directamente sin wrapper — internamente ya es un flex row.',
    'children se centra automáticamente; si solo querés title alineado a la izquierda, no uses children.',
  ],
  examples: [
    {
      title: 'Solo título',
      description: 'La forma más simple — título de sección sin acciones.',
      node: (
        <div style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border,rgba(255,255,255,.1))' }}>
          <Topbar sticky={false} title="Mi aplicación" />
        </div>
      ),
      code: `<Topbar title="Mi aplicación" />`,
    },
    {
      title: 'Con left y right',
      description: 'Botón de menú a la izquierda, ícono de notificaciones a la derecha.',
      node: (
        <div style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border,rgba(255,255,255,.1))' }}>
          <Topbar
            sticky={false}
            title="Dashboard"
            left={
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground,#9AA6B2)', display: 'grid', placeItems: 'center', padding: 0 }}>
                <Bars3Icon style={{ width: 22, height: 22 }} />
              </button>
            }
            right={
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground,#9AA6B2)', display: 'grid', placeItems: 'center', padding: 0 }}>
                <BellIcon style={{ width: 20, height: 20 }} />
              </button>
            }
          />
        </div>
      ),
      code: `<Topbar
  title="Dashboard"
  left={<MenuToggle />}
  right={<BellButton />}
/>`,
    },
    {
      title: 'Con buscador central',
      description: 'children ocupa el espacio central — ideal para SearchInput.',
      node: (
        <div style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border,rgba(255,255,255,.1))' }}>
          <Topbar
            sticky={false}
            left={
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground,#9AA6B2)', display: 'grid', placeItems: 'center', padding: 0 }}>
                <ArrowLeftIcon style={{ width: 20, height: 20 }} />
              </button>
            }
            right={
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground,#9AA6B2)', display: 'grid', placeItems: 'center', padding: 0 }}>
                <UserIcon style={{ width: 20, height: 20 }} />
              </button>
            }
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '320px', width: '100%',
              padding: '7px 12px', borderRadius: '10px',
              background: 'var(--muted,#1F2530)', border: '1px solid var(--border,rgba(255,255,255,.1))',
            }}>
              <MagnifyingGlassIcon style={{ width: 16, height: 16, color: 'var(--subtle-foreground,#6B7480)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Archivo', fontSize: '13.5px', color: 'var(--subtle-foreground,#6B7480)' }}>Buscar…</span>
            </div>
          </Topbar>
        </div>
      ),
      code: `<Topbar left={<BackButton />} right={<Avatar />}>
  <SearchInput placeholder="Buscar…" />
</Topbar>`,
    },
    {
      title: 'sticky=false',
      description: 'Para topbars dentro de contenedores con scroll propio.',
      node: (
        <div style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border,rgba(255,255,255,.1))' }}>
          <Topbar
            sticky={false}
            title="Panel lateral"
            right={
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground,#9AA6B2)', display: 'grid', placeItems: 'center', padding: 0 }}>
                <Cog6ToothIcon style={{ width: 18, height: 18 }} />
              </button>
            }
          />
        </div>
      ),
      code: `<Topbar sticky={false} title="Panel lateral" right={<SettingsButton />} />`,
    },
    {
      title: 'Múltiples acciones en right',
      description: 'El slot right es un flex row — pasá varios nodos directamente sin wrapper.',
      node: (
        <div style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border,rgba(255,255,255,.1))' }}>
          <Topbar
            sticky={false}
            title="Reservas"
            right={<>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground,#9AA6B2)', display: 'grid', placeItems: 'center', padding: 0 }}>
                <MagnifyingGlassIcon style={{ width: 18, height: 18 }} />
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground,#9AA6B2)', display: 'grid', placeItems: 'center', padding: 0 }}>
                <BellIcon style={{ width: 18, height: 18 }} />
              </button>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'var(--primary,#C9A24B)', display: 'grid', placeItems: 'center',
                fontFamily: 'Archivo', fontWeight: 800, fontSize: 13, color: 'var(--primary-foreground,#1A1407)',
              }}>JG</div>
            </>}
          />
        </div>
      ),
      code: `<Topbar title="Reservas" right={<>
  <SearchButton />
  <BellButton />
  <Avatar initials="JG" />
</>} />`,
    },
  ],
}

// ─── Sidebar (collapsible, submenus, hover flyout/tooltip) ──────────────────

const SB_BRAND = (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ width: '30px', height: '30px', borderRadius: '8px', display: 'grid', placeItems: 'center', background: 'var(--primary,#C9A24B)', color: 'var(--primary-foreground,#1A1407)', fontFamily: 'Archivo', fontWeight: 900, flex: '0 0 auto' }}>P</span>
    <span style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: '15px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap' }}>Palqueate</span>
  </div>
)

const SB_GROUPS: NavGroup[] = [
  {
    title: 'General',
    items: [
      { key: 'dashboard', title: 'Dashboard', icon: <HomeIcon /> },
      { key: 'team', title: 'Equipo', icon: <UserIcon />, badge: '12' },
      {
        key: 'projects', title: 'Proyectos', icon: <Squares2X2Icon />,
        children: [
          {
            key: 'alpha', title: 'Alpha', initial: 'A',
            children: [
              { key: 'backend', title: 'Backend' },
              {
                key: 'frontend', title: 'Frontend',
                children: [
                  { key: 'components', title: 'Componentes' },
                  { key: 'pages', title: 'Páginas' },
                ],
              },
            ],
          },
          { key: 'infra', title: 'Infra', badge: '3' },
          { key: 'beta', title: 'Beta', initial: 'B', children: [{ key: 'beta-1', title: 'Sprint 1' }] },
        ],
      },
      { key: 'reports', title: 'Reportes', icon: <ChartBarIcon /> },
      { key: 'inbox', title: 'Mensajes', icon: <InboxIcon />, badge: '5' },
    ],
  },
  {
    title: 'Cuenta', pushToBottom: true,
    items: [
      {
        key: 'settings', title: 'Ajustes', icon: <Cog6ToothIcon />,
        children: [
          { key: 'set-general', title: 'General' },
          { key: 'set-billing', title: 'Facturación' },
          { key: 'set-team', title: 'Equipo' },
        ],
      },
      { key: 'notifs', title: 'Notificaciones', icon: <BellIcon />, badge: '9' },
    ],
  },
]

function SidebarBox({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: '100%', height: '480px', display: 'flex', border: '1px solid var(--border,rgba(255,255,255,.1))', borderRadius: '14px', overflow: 'visible', background: 'var(--background,#0E1116)' }}>
      {children}
    </div>
  )
}

function SidebarFullDemo() {
  const [active, setActive] = useState('components')
  return (
    <SidebarBox>
      <Sidebar groups={SB_GROUPS} activeKey={active} onNavigate={(it) => setActive(it.key as string)} brandContent={SB_BRAND} collapsedBrandContent={SB_BRAND} embedded />
      <div style={{ flex: 1, padding: '24px', color: 'var(--muted-foreground,#9AA6B2)', fontFamily: 'Archivo', fontSize: '14px' }}>
        Activo: <strong style={{ color: 'var(--primary,#C9A24B)' }}>{active}</strong>
        <div style={{ marginTop: '8px', fontSize: '13px' }}>Anidación recursiva sin límite. Tocá el chevron flotante para colapsar.</div>
      </div>
    </SidebarBox>
  )
}

function SidebarCollapsedDemo() {
  const [active, setActive] = useState('set-billing')
  return (
    <SidebarBox>
      <Sidebar groups={SB_GROUPS} activeKey={active} onNavigate={(it) => setActive(it.key as string)} brandContent={SB_BRAND} collapsedBrandContent={SB_BRAND} collapsed collapsible={false} embedded />
      <div style={{ flex: 1, padding: '24px', color: 'var(--muted-foreground,#9AA6B2)', fontFamily: 'Archivo', fontSize: '14px' }}>
        Pasá el mouse por los íconos del rail: los que <strong style={{ color: 'var(--foreground,#F4EFE6)' }}>no</strong> tienen submenú muestran <strong style={{ color: 'var(--foreground,#F4EFE6)' }}>tooltip</strong>; los que sí, un <strong style={{ color: 'var(--foreground,#F4EFE6)' }}>menú flotante</strong>.
      </div>
    </SidebarBox>
  )
}

const sidebarEntry: DocEntry = {
  slug: 'sidebar',
  name: 'Sidebar',
  category: 'Navegación',
  description: 'Navegación tipo app-shell: sidebar fija (o colapsable) + topbar + cuerpo principal. Soporta grupos, badges, iniciales, íconos Heroicon y submenús con anidación recursiva sin límite. Expandido los ítems con hijos se despliegan inline (acordeón); colapsado, al pasar el mouse muestran tooltip (hoja) o menú flotante (con submenú). El badge aparece a la derecha, antes del chevron.',
  importLine: "import { Sidebar } from './lib'\nimport type { NavItem, NavGroup } from './lib'",
  props: [
    { name: 'groups', type: 'NavGroup[]', required: true, description: 'Grupos de navegación. NavGroup: { title?, items, pushToBottom? }.' },
    { name: 'brandContent', type: 'ReactNode', description: 'Contenido del header (logo / marca).' },
    { name: 'collapsedBrandContent', type: 'ReactNode', description: 'Marca alternativa cuando está colapsada (típicamente el isotipo).' },
    { name: 'topBarRight', type: 'ReactNode', description: 'Contenido del topbar (search, perfil, acciones). Ignorado en embedded.' },
    { name: 'children', type: 'ReactNode', description: 'Cuerpo principal, a la derecha de la sidebar. Ignorado en embedded.' },
    { name: 'activeKey', type: 'string', description: 'Key/href del ítem activo. Resalta el ítem y el rastro de su padre.' },
    { name: 'collapsed', type: 'boolean', description: 'Estado colapsado controlado.' },
    { name: 'defaultCollapsed', type: 'boolean', default: 'false', description: 'Estado colapsado inicial (no controlado).' },
    { name: 'collapsible', type: 'boolean', default: 'true', description: 'Muestra el chevron flotante para colapsar/expandir.' },
    { name: 'embedded', type: 'boolean', default: 'false', description: 'Modo demo: renderiza solo el panel, sin shell/topbar/main.' },
    { name: 'width', type: 'number', default: '288', description: 'Ancho expandido en px.' },
    { name: 'collapsedWidth', type: 'number', default: '64', description: 'Ancho colapsado en px.' },
  ],
  events: [
    { name: 'onNavigate', type: '(item: NavItem) => void', description: 'Se dispara al elegir un ítem hoja (sin hijos). También se llama su item.onClick.' },
    { name: 'onCollapsedChange', type: '(collapsed: boolean) => void', description: 'Cambio de estado colapsado.' },
  ],
  notes: [
    'NavItem: { title, href?|onClick?, icon?, initial?, badge?, children?, defaultOpen?, external?, key? }. Un ítem con children actúa como toggle (no navega).',
    'La anidación es recursiva sin límite de niveles. defaultOpen (true por defecto) controla si un submenú arranca abierto.',
    'NavGroup.pushToBottom empuja el grupo al final (ej. la sección de cuenta).',
    'Colapsado el menú flotante usa un puente invisible para que el mouse pueda pasar del ícono al panel sin cerrarlo.',
    'Reacciona al tema activo: todo usa las vars cortas de Palqueate con fallback.',
  ],
  examples: [
    {
      title: 'App-shell con anidación recursiva',
      description: 'Grupos, badges, iniciales, submenús anidados y chevron flotante para colapsar.',
      node: <SidebarFullDemo />,
      code: "const groups: NavGroup[] = [\n  { title: 'General', items: [\n    { key: 'dashboard', title: 'Dashboard', icon: <HomeIcon /> },\n    { key: 'team', title: 'Equipo', icon: <UserIcon />, badge: '12' },\n    { key: 'projects', title: 'Proyectos', icon: <FolderIcon />, children: [\n      { key: 'alpha', title: 'Alpha', initial: 'A', children: [\n        { key: 'backend', title: 'Backend' },\n        { key: 'frontend', title: 'Frontend', children: [\n          { key: 'components', title: 'Componentes' },\n        ]},\n      ]},\n    ]},\n  ]},\n]\n<Sidebar groups={groups} activeKey={active} onNavigate={it => setActive(it.key)}\n  brandContent={<Brand />} topBarRight={<Actions />}>{<Main />}</Sidebar>",
    },
    {
      title: 'Colapsado — tooltip vs flyout',
      description: 'Hoja → tooltip. Con submenú → menú flotante (recursivo).',
      node: <SidebarCollapsedDemo />,
      code: '<Sidebar groups={groups} activeKey={active} collapsed embedded />',
    },
  ],
}

const entries: DocEntry[] = [
  tabsEntry,
  breadcrumbEntry,
  paginationEntry,
  stepperEntry,
  timelineEntry,
  navSidebarEntry,
  sidebarEntry,
  topbarEntry,
]

export default entries
