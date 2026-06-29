import { useState } from 'react'
import type { DocEntry } from '../types'
import Carousel from '../../Carousel'
import Splitter from '../../Splitter'
import NavMenu from '../../NavMenu'

// ---------------------------------------------------------------------------
// Carousel demos
// ---------------------------------------------------------------------------

function SlidePanel({ bg, label }: { bg: string; label: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Archivo',
        fontWeight: 700,
        fontSize: '22px',
        color: 'var(--foreground,#F4EFE6)',
        letterSpacing: '.02em',
      }}
    >
      {label}
    </div>
  )
}

const colorSlides = [
  <SlidePanel key="a" bg="color-mix(in srgb, var(--primary,#C9A24B) 22%, var(--card,#171B22))" label="Diapositiva 1" />,
  <SlidePanel key="b" bg="color-mix(in srgb, var(--success,#4CAF50) 18%, var(--card,#171B22))" label="Diapositiva 2" />,
  <SlidePanel key="c" bg="color-mix(in srgb, var(--destructive,#E5604D) 18%, var(--card,#171B22))" label="Diapositiva 3" />,
  <SlidePanel key="d" bg="color-mix(in srgb, #7C6AF7 20%, var(--card,#171B22))" label="Diapositiva 4" />,
]

function CarouselBasicDemo() {
  return (
    <div style={{ width: '100%', maxWidth: '520px' }}>
      <Carousel slides={colorSlides} />
    </div>
  )
}

function CarouselAutoPlayDemo() {
  return (
    <div style={{ width: '100%', maxWidth: '520px' }}>
      <Carousel slides={colorSlides} autoPlay interval={2500} height={200} />
    </div>
  )
}

function CarouselNoDotsDemo() {
  return (
    <div style={{ width: '100%', maxWidth: '520px' }}>
      <Carousel slides={colorSlides} showDots={false} height={180} />
    </div>
  )
}

function CarouselNoArrowsDemo() {
  return (
    <div style={{ width: '100%', maxWidth: '520px' }}>
      <Carousel slides={colorSlides} showArrows={false} height={180} />
    </div>
  )
}

function CarouselMinimalDemo() {
  const twoSlides = [
    <SlidePanel key="1" bg="color-mix(in srgb, var(--primary,#C9A24B) 18%, var(--muted,#1F2530))" label="A" />,
    <SlidePanel key="2" bg="color-mix(in srgb, var(--success,#4CAF50) 14%, var(--muted,#1F2530))" label="B" />,
  ]
  return (
    <div style={{ width: '100%', maxWidth: '320px' }}>
      <Carousel slides={twoSlides} showDots={false} showArrows height={140} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Splitter demos
// ---------------------------------------------------------------------------

function PaneBox({ label, bg }: { label: string; bg?: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: bg ?? 'var(--muted,#1F2530)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Archivo',
        fontWeight: 600,
        fontSize: '14px',
        color: 'var(--muted-foreground,#9AA6B2)',
      }}
    >
      {label}
    </div>
  )
}

function SplitterBasicDemo() {
  return (
    <div
      style={{
        width: '100%',
        height: '260px',
        border: '1px solid var(--border,rgba(255,255,255,.1))',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <Splitter
        left={<PaneBox label="Panel izquierdo" />}
        right={<PaneBox label="Panel derecho" bg="var(--card,#171B22)" />}
      />
    </div>
  )
}

function SplitterCustomSplitDemo() {
  return (
    <div
      style={{
        width: '100%',
        height: '220px',
        border: '1px solid var(--border,rgba(255,255,255,.1))',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <Splitter
        left={<PaneBox label="30 %" />}
        right={<PaneBox label="70 %" bg="var(--card,#171B22)" />}
        defaultSplit={30}
      />
    </div>
  )
}

function SplitterVerticalDemo() {
  return (
    <div
      style={{
        width: '100%',
        height: '280px',
        border: '1px solid var(--border,rgba(255,255,255,.1))',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <Splitter
        direction="vertical"
        left={<PaneBox label="Panel superior" />}
        right={<PaneBox label="Panel inferior" bg="var(--card,#171B22)" />}
      />
    </div>
  )
}

function SplitterConstrainedDemo() {
  return (
    <div
      style={{
        width: '100%',
        height: '220px',
        border: '1px solid var(--border,rgba(255,255,255,.1))',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <Splitter
        left={<PaneBox label="min 25 %" />}
        right={<PaneBox label="max 75 %" bg="var(--card,#171B22)" />}
        defaultSplit={50}
        min={25}
        max={75}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// NavMenu demos
// ---------------------------------------------------------------------------

const simpleItems = [
  { key: 'inicio', label: 'Inicio' },
  { key: 'eventos', label: 'Eventos' },
  { key: 'nosotros', label: 'Nosotros' },
  { key: 'contacto', label: 'Contacto' },
]

const richItems = [
  { key: 'inicio', label: 'Inicio' },
  {
    key: 'productos',
    label: 'Productos',
    children: [
      { key: 'entradas', label: 'Entradas' },
      { key: 'abonos', label: 'Abonos' },
      { key: 'palcos', label: 'Palcos VIP' },
    ],
  },
  {
    key: 'empresa',
    label: 'Empresa',
    children: [
      { key: 'nosotros', label: 'Nosotros' },
      { key: 'equipo', label: 'Equipo' },
      { key: 'prensa', label: 'Prensa' },
    ],
  },
  { key: 'contacto', label: 'Contacto' },
]

function NavMenuSimpleDemo() {
  const [active, setActive] = useState('inicio')
  return (
    <div style={{ width: '100%', background: 'var(--card,#171B22)', borderRadius: '10px', overflow: 'hidden' }}>
      <NavMenu items={simpleItems} active={active} onSelect={setActive} />
      <div style={{ padding: '12px 16px', fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
        Activo: <strong style={{ color: 'var(--primary,#C9A24B)' }}>{active}</strong>
      </div>
    </div>
  )
}

function NavMenuDropdownDemo() {
  const [active, setActive] = useState('inicio')
  return (
    <div style={{ width: '100%', background: 'var(--card,#171B22)', borderRadius: '10px', overflow: 'visible' }}>
      <NavMenu items={richItems} active={active} onSelect={setActive} />
      <div style={{ padding: '12px 16px', fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
        Activo: <strong style={{ color: 'var(--primary,#C9A24B)' }}>{active}</strong>
      </div>
    </div>
  )
}

function NavMenuActiveChildDemo() {
  const [active, setActive] = useState('palcos')
  return (
    <div style={{ width: '100%', background: 'var(--card,#171B22)', borderRadius: '10px', overflow: 'visible' }}>
      <NavMenu items={richItems} active={active} onSelect={setActive} />
      <div style={{ padding: '12px 16px', fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
        Activo: <strong style={{ color: 'var(--primary,#C9A24B)' }}>{active}</strong>
      </div>
    </div>
  )
}

function NavMenuIconsDemo() {
  const HomeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
  const CalIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
  const TicketIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z" />
    </svg>
  )
  const iconItems = [
    { key: 'inicio', label: 'Inicio', icon: <HomeIcon /> },
    {
      key: 'eventos',
      label: 'Eventos',
      icon: <CalIcon />,
      children: [
        { key: 'proximos', label: 'Próximos' },
        { key: 'pasados', label: 'Pasados' },
      ],
    },
    { key: 'entradas', label: 'Entradas', icon: <TicketIcon /> },
  ]
  const [active, setActive] = useState('inicio')
  return (
    <div style={{ width: '100%', background: 'var(--card,#171B22)', borderRadius: '10px', overflow: 'visible' }}>
      <NavMenu items={iconItems} active={active} onSelect={setActive} />
      <div style={{ padding: '12px 16px', fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
        Activo: <strong style={{ color: 'var(--primary,#C9A24B)' }}>{active}</strong>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DocEntry definitions
// ---------------------------------------------------------------------------

const carouselEntry: DocEntry = {
  slug: 'carousel',
  name: 'Carousel',
  category: 'Layout',
  description:
    'Carrusel de diapositivas con transición suave, botones de navegación y puntos indicadores. Soporta reproducción automática con limpieza de intervalo al desmontar.',
  importLine: "import Carousel from './lib/Carousel'",
  props: [
    {
      name: 'slides',
      type: 'ReactNode[]',
      required: true,
      description: 'Arreglo de nodos React; cada uno ocupa una diapositiva.',
    },
    {
      name: 'autoPlay',
      type: 'boolean',
      default: 'false',
      description: 'Avanza automáticamente entre diapositivas.',
    },
    {
      name: 'interval',
      type: 'number',
      default: '4000',
      description: 'Milisegundos entre cambios automáticos (requiere autoPlay).',
    },
    {
      name: 'showDots',
      type: 'boolean',
      default: 'true',
      description: 'Muestra los puntos indicadores de posición.',
    },
    {
      name: 'showArrows',
      type: 'boolean',
      default: 'true',
      description: 'Muestra los botones de navegación anterior / siguiente.',
    },
    {
      name: 'height',
      type: 'number | string',
      default: '320',
      description: 'Alto del viewport (número = px, string = cualquier unidad CSS).',
    },
  ],
  events: [],
  notes: [
    'El intervalo de autoPlay se pausa cuando el puntero entra al componente y se limpia al desmontar.',
    'Los puntos activos se ensanchan con transición CSS para indicar la diapositiva actual.',
    'Cada diapositiva debe ocupar el 100% del espacio disponible para un comportamiento correcto.',
  ],
  examples: [
    {
      title: 'Básico',
      description: 'Cuatro diapositivas con colores de tema, flechas y puntos.',
      node: <CarouselBasicDemo />,
      code: `<Carousel slides={[<Slide1 />, <Slide2 />, <Slide3 />, <Slide4 />]} />`,
    },
    {
      title: 'AutoPlay',
      description: 'Avanza cada 2.5 segundos; el puntero lo pausa.',
      node: <CarouselAutoPlayDemo />,
      code: `<Carousel slides={slides} autoPlay interval={2500} height={200} />`,
    },
    {
      title: 'Sin puntos',
      node: <CarouselNoDotsDemo />,
      code: `<Carousel slides={slides} showDots={false} height={180} />`,
    },
    {
      title: 'Sin flechas',
      node: <CarouselNoArrowsDemo />,
      code: `<Carousel slides={slides} showArrows={false} height={180} />`,
    },
    {
      title: 'Solo flechas, dos slides',
      node: <CarouselMinimalDemo />,
      code: `<Carousel slides={[<A />, <B />]} showDots={false} showArrows height={140} />`,
    },
  ],
}

const splitterEntry: DocEntry = {
  slug: 'splitter',
  name: 'Splitter',
  category: 'Layout',
  description:
    'Divide el espacio en dos paneles redimensionables mediante un divisor arrastrable. Soporta orientación horizontal y vertical, con límites mínimo y máximo configurables.',
  importLine: "import Splitter from './lib/Splitter'",
  props: [
    {
      name: 'left',
      type: 'ReactNode',
      required: true,
      description: 'Contenido del primer panel (izquierdo o superior).',
    },
    {
      name: 'right',
      type: 'ReactNode',
      required: true,
      description: 'Contenido del segundo panel (derecho o inferior).',
    },
    {
      name: 'defaultSplit',
      type: 'number',
      default: '50',
      description: 'Porcentaje inicial del primer panel (0–100).',
    },
    {
      name: 'min',
      type: 'number',
      default: '15',
      description: 'Tamaño mínimo del primer panel en porcentaje.',
    },
    {
      name: 'max',
      type: 'number',
      default: '85',
      description: 'Tamaño máximo del primer panel en porcentaje.',
    },
    {
      name: 'direction',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Eje de división: horizontal separa izquierda/derecha; vertical separa arriba/abajo.',
    },
  ],
  events: [],
  notes: [
    'El divisor usa window pointermove/pointerup para seguir el cursor incluso fuera del contenedor.',
    'El borde y el grip del divisor se tiñen con --primary mientras se arrastra.',
    'El contenedor padre debe tener un alto definido para que los paneles se rendericen correctamente.',
  ],
  examples: [
    {
      title: 'Horizontal (por defecto)',
      description: 'Arrastrá el divisor central para redistribuir el espacio.',
      node: <SplitterBasicDemo />,
      code: `<Splitter left={<Left />} right={<Right />} />`,
    },
    {
      title: 'Split inicial personalizado (30/70)',
      node: <SplitterCustomSplitDemo />,
      code: `<Splitter left={<Left />} right={<Right />} defaultSplit={30} />`,
    },
    {
      title: 'Vertical',
      description: 'División superior / inferior.',
      node: <SplitterVerticalDemo />,
      code: `<Splitter direction="vertical" left={<Top />} right={<Bottom />} />`,
    },
    {
      title: 'Con límites min/max (25–75)',
      node: <SplitterConstrainedDemo />,
      code: `<Splitter left={<Left />} right={<Right />} min={25} max={75} />`,
    },
  ],
}

const navMenuEntry: DocEntry = {
  slug: 'nav-menu',
  name: 'NavMenu',
  category: 'Navegación',
  description:
    'Barra de menú horizontal con ítems de primer nivel y dropdowns opcionales. Los ítems con hijos abren un panel desplegable al hacer clic; los ítems hoja llaman a onSelect directamente.',
  importLine: "import NavMenu from './lib/NavMenu'",
  props: [
    {
      name: 'items',
      type: 'NavMenuItem[]',
      required: true,
      description:
        'Lista de ítems del menú. Cada uno puede tener children para generar un dropdown.',
    },
    {
      name: 'active',
      type: 'string',
      description:
        'Clave del ítem activo. Si corresponde a un hijo, el padre también se marca activo.',
    },
    {
      name: 'onSelect',
      type: '(key: string) => void',
      description:
        'Callback al seleccionar un ítem hoja (top-level sin hijos, o hijo de dropdown).',
    },
  ],
  events: [
    {
      name: 'onSelect',
      type: '(key: string) => void',
      description: 'Se dispara al seleccionar cualquier ítem hoja.',
    },
  ],
  notes: [
    'El dropdown se cierra al hacer clic fuera del componente (window mousedown listener limpiado en useEffect).',
    'El chevron del ítem padre rota 180° cuando el dropdown está abierto.',
    'A diferencia de Sidebar, NavMenu es estrictamente horizontal — diseñado para barras de navegación superiores.',
  ],
  examples: [
    {
      title: 'Ítems simples',
      description: 'Sin submenús; todos los ítems son hojas.',
      node: <NavMenuSimpleDemo />,
      code: `<NavMenu items={simpleItems} active={active} onSelect={setActive} />`,
    },
    {
      title: 'Con dropdowns',
      description: 'Hacé clic en "Productos" o "Empresa" para ver el panel desplegable.',
      node: <NavMenuDropdownDemo />,
      code: `<NavMenu items={richItems} active={active} onSelect={setActive} />`,
    },
    {
      title: 'Ítem hijo activo',
      description: 'El padre muestra el estado activo cuando el hijo seleccionado es "palcos".',
      node: <NavMenuActiveChildDemo />,
      code: `<NavMenu items={richItems} active="palcos" onSelect={setActive} />`,
    },
    {
      title: 'Con íconos',
      description: 'Los ítems aceptan ReactNode en la prop icon.',
      node: <NavMenuIconsDemo />,
      code: `<NavMenu items={iconItems} active={active} onSelect={setActive} />`,
    },
  ],
}

const entries: DocEntry[] = [carouselEntry, splitterEntry, navMenuEntry]
export default entries
