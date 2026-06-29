import { useState } from 'react'
import type { DocEntry } from '../types'
import Tree from '../../Tree'
import type { TreeNode } from '../../Tree'
import VirtualList from '../../VirtualList'
import Sparkline from '../../Sparkline'
import Statistic from '../../Statistic'
import Result from '../../Result'
import Code from '../../Code'

// ── Tree demos ────────────────────────────────────────────────────

const TREE_NODES: TreeNode[] = [
  {
    key: 'app', label: 'src', children: [
      {
        key: 'components', label: 'components', children: [
          { key: 'btn', label: 'Btn.tsx' },
          { key: 'input', label: 'Input.tsx' },
        ],
      },
      {
        key: 'lib', label: 'lib', children: [
          { key: 'tree', label: 'Tree.tsx' },
          { key: 'table', label: 'Table.tsx' },
        ],
      },
      { key: 'main', label: 'main.tsx' },
    ],
  },
]

function TreeBasicDemo() {
  const [active, setActive] = useState('btn')
  return (
    <div style={{ width: '100%', maxWidth: '320px' }}>
      <Tree nodes={TREE_NODES} active={active} defaultExpanded={['app', 'components']} onSelect={setActive} />
      <p style={{ margin: '8px 0 0', fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--subtle-foreground,#6B7480)' }}>
        activo: {active}
      </p>
    </div>
  )
}

const TREE_ICONS_NODES: TreeNode[] = [
  {
    key: 'docs', label: 'Documentos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    ),
    children: [
      { key: 'q1', label: 'Informe Q1.pdf', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" /></svg> },
      { key: 'q2', label: 'Informe Q2.pdf', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" /></svg> },
    ],
  },
  {
    key: 'imgs', label: 'Imágenes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21,15 16,10 5,21" />
      </svg>
    ),
    children: [
      { key: 'hero', label: 'hero.png' },
      { key: 'logo', label: 'logo.svg' },
    ],
  },
]

function TreeIconsDemo() {
  const [active, setActive] = useState('hero')
  return (
    <div style={{ width: '100%', maxWidth: '300px' }}>
      <Tree nodes={TREE_ICONS_NODES} active={active} defaultExpanded={['docs', 'imgs']} onSelect={setActive} />
    </div>
  )
}

// ── VirtualList demos ─────────────────────────────────────────────

const BIG_LIST = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, name: `Elemento #${i + 1}`, value: Math.round(Math.random() * 10000) }))

function VirtualBasicDemo() {
  return (
    <div style={{ width: '100%' }}>
      <VirtualList
        items={BIG_LIST}
        itemHeight={44}
        height={260}
        renderItem={(item) => (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: '100%', padding: '0 16px',
            borderBottom: '1px solid var(--border,rgba(255,255,255,.06))',
            fontFamily: 'Archivo', fontSize: '13.5px', color: 'var(--muted-foreground,#9AA6B2)',
          }}>
            <span style={{ color: 'var(--foreground,#F4EFE6)', fontWeight: 600 }}>{item.name}</span>
            <span style={{ fontFamily: "'Space Mono'", fontSize: '11px' }}>{item.value.toLocaleString()}</span>
          </div>
        )}
      />
      <p style={{ margin: '8px 0 0', fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--subtle-foreground,#6B7480)' }}>
        1000 filas, solo se renderizan las visibles
      </p>
    </div>
  )
}

function VirtualCustomDemo() {
  const statusList = Array.from({ length: 500 }, (_, i) => ({
    id: i,
    label: `Tarea ${i + 1}`,
    done: Math.random() > 0.5,
  }))
  return (
    <div style={{ width: '100%' }}>
      <VirtualList
        items={statusList}
        itemHeight={38}
        height={200}
        overscan={6}
        renderItem={(item) => (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            height: '100%', padding: '0 14px',
            borderBottom: '1px solid var(--border,rgba(255,255,255,.05))',
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%', flex: '0 0 auto',
              background: item.done ? 'var(--success,#34D17E)' : 'var(--subtle-foreground,#6B7480)',
            }} />
            <span style={{ fontFamily: 'Archivo', fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>{item.label}</span>
            <span style={{ marginLeft: 'auto', fontFamily: "'Space Mono'", fontSize: '10px', color: item.done ? 'var(--success,#34D17E)' : 'var(--subtle-foreground,#6B7480)' }}>
              {item.done ? 'hecho' : 'pendiente'}
            </span>
          </div>
        )}
      />
    </div>
  )
}

// ── Sparkline demos ───────────────────────────────────────────────

const SPARK_REVENUE = [12, 18, 14, 22, 19, 28, 25, 30, 27, 35, 32, 40]
const SPARK_FLAT = [10, 10, 11, 10, 10, 11, 10, 10, 10, 11, 10, 10]
const SPARK_DROP = [40, 38, 35, 30, 22, 18, 15, 12, 9, 7, 5, 3]
const SPARK_SPIKY = [5, 20, 8, 30, 12, 25, 6, 28, 10, 22, 15, 35]

function SparklineVariantsDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {[
        { data: SPARK_REVENUE, label: 'Línea + relleno', color: 'var(--primary,#C9A24B)', type: 'line' as const, fill: true },
        { data: SPARK_DROP, label: 'Línea sin relleno (danger)', color: 'var(--destructive,#E5604D)', type: 'line' as const, fill: false },
        { data: SPARK_SPIKY, label: 'Barras (go)', color: 'var(--success,#34D17E)', type: 'bar' as const, fill: false },
      ].map((cfg) => (
        <div key={cfg.label} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: '10px', color: 'var(--subtle-foreground,#6B7480)', minWidth: '180px' }}>{cfg.label}</span>
          <Sparkline data={cfg.data} width={140} height={36} color={cfg.color} type={cfg.type} fill={cfg.fill} />
        </div>
      ))}
    </div>
  )
}

function SparklineSizesDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
      <Sparkline data={SPARK_REVENUE} width={80} height={24} type="line" fill />
      <Sparkline data={SPARK_REVENUE} width={120} height={32} type="line" fill />
      <Sparkline data={SPARK_REVENUE} width={200} height={48} type="bar" color="var(--primary,#C9A24B)" />
    </div>
  )
}

function SparklineFlatDemo() {
  return <Sparkline data={SPARK_FLAT} width={140} height={32} color="var(--subtle-foreground,#6B7480)" type="line" />
}

// ── Statistic demos ───────────────────────────────────────────────

function StatisticBasicDemo() {
  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <Statistic label="Ingresos totales" value={128450} prefix="$" decimals={0} />
      <Statistic label="Usuarios activos" value={3842} decimals={0} />
      <Statistic label="Tasa de conversión" value={4.73} suffix="%" decimals={2} />
    </div>
  )
}

function StatisticCountUpDemo() {
  const [key, setKey] = useState(0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <Statistic key={key} label="Ventas del mes" value={87200} prefix="$" decimals={0} countUp />
      <button
        onClick={() => setKey((k) => k + 1)}
        style={{
          padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border,rgba(255,255,255,.1))',
          background: 'var(--muted,#1F2530)', color: 'var(--muted-foreground,#9AA6B2)',
          cursor: 'pointer', fontFamily: 'Archivo', fontSize: '13px',
        }}
      >
        Reiniciar animación
      </button>
    </div>
  )
}

function StatisticTrendDemo() {
  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <Statistic label="Nuevos clientes" value={542} decimals={0} countUp trend={{ value: 12.4, direction: 'up' }} />
      <Statistic label="Tasa de rebote" value={38.2} suffix="%" decimals={1} trend={{ value: 5.1, direction: 'down' }} />
      <Statistic label="Tickets abiertos" value={17} decimals={0} trend={{ value: 2.3, direction: 'up' }} />
    </div>
  )
}

// ── Result demos ──────────────────────────────────────────────────

function ResultSuccessDemo() {
  return (
    <Result
      status="success"
      title="¡Pago procesado!"
      description="Tu compra fue confirmada. Vas a recibir un correo con los detalles en breve."
      actions={
        <button style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: 'var(--success,#34D17E)', color: '#0E1116', fontFamily: 'Archivo', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
          Ver pedido
        </button>
      }
    />
  )
}

function ResultErrorDemo() {
  return (
    <Result
      status="error"
      title="No se pudo procesar"
      description="Hubo un problema con tu método de pago. Revisá los datos e intentá de nuevo."
      actions={
        <>
          <button style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: 'var(--destructive,#E5604D)', color: '#fff', fontFamily: 'Archivo', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
            Reintentar
          </button>
          <button style={{ padding: '9px 20px', borderRadius: '10px', border: '1px solid var(--border,rgba(255,255,255,.15))', background: 'transparent', color: 'var(--muted-foreground,#9AA6B2)', fontFamily: 'Archivo', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            Cancelar
          </button>
        </>
      }
    />
  )
}

function ResultAllStatusDemo() {
  const statuses = ['success', 'error', 'info', 'warning', 'empty'] as const
  const titles: Record<typeof statuses[number], string> = {
    success: 'Operación exitosa',
    error: 'Algo falló',
    info: 'Información importante',
    warning: 'Atención requerida',
    empty: 'Nada por aquí',
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', width: '100%' }}>
      {statuses.map((s) => (
        <div key={s} style={{ flex: '1 1 160px', minWidth: '160px' }}>
          <Result status={s} title={titles[s]} />
        </div>
      ))}
    </div>
  )
}

// ── Code demos ────────────────────────────────────────────────────

const SAMPLE_TSX = `import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clics: {count}
    </button>
  )
}`

const SAMPLE_JSON = `{
  "name": "palqueate",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  }
}`

function CodeBasicDemo() {
  return <Code code={SAMPLE_TSX} language="tsx" copyable />
}

function CodeNoCopyDemo() {
  return <Code code={SAMPLE_JSON} language="json" copyable={false} />
}

function CodeNoLangDemo() {
  return <Code code="npm install palqueate" copyable />
}

// ── Entries ───────────────────────────────────────────────────────

const treeEntry: DocEntry = {
  slug: 'tree',
  name: 'Tree',
  category: 'Datos',
  description: 'Árbol jerárquico expandible. Soporta nodos con íconos, selección activa con resaltado brand, indentación recursiva y chevron animado.',
  importLine: "import Tree from './lib/Tree'",
  props: [
    { name: 'nodes', type: 'TreeNode[]', default: '[]', description: 'Arreglo raíz de nodos. Cada nodo puede tener children para sub-árboles.' },
    { name: 'active', type: 'string', description: 'Clave del nodo activo (resaltado con color brand).' },
    { name: 'defaultExpanded', type: 'string[]', default: '[]', description: 'Claves de nodos expandidos al montar.' },
  ],
  events: [
    { name: 'onSelect', type: '(key: string) => void', description: 'Se dispara cuando el usuario selecciona un nodo hoja.' },
  ],
  notes: [
    'Los nodos con children no disparan onSelect al hacer clic; solo expanden/colapsan.',
    'La estructura TreeNode es recursiva: { key, label, icon?, children? }.',
    'El árbol no controla su estado de expansión externamente; es siempre uncontrolled.',
  ],
  examples: [
    {
      title: 'Estructura de archivos',
      description: 'Árbol con nodos expandidos por defecto y selección activa.',
      node: <TreeBasicDemo />,
      code: `<Tree
  nodes={nodes}
  active={active}
  defaultExpanded={['app', 'components']}
  onSelect={setActive}
/>`,
    },
    {
      title: 'Con íconos',
      description: 'Cada nodo acepta cualquier ReactNode como ícono.',
      node: <TreeIconsDemo />,
      code: `const nodes = [
  { key: 'docs', label: 'Documentos', icon: <FolderIcon />, children: [...] },
]
<Tree nodes={nodes} active={active} onSelect={setActive} />`,
    },
  ],
}

const virtualListEntry: DocEntry = {
  slug: 'virtual-list',
  name: 'VirtualList',
  category: 'Datos',
  description: 'Lista de scroll virtualizado. Renderiza solo las filas visibles más overscan, ideal para listas de miles de items sin costo de DOM.',
  importLine: "import VirtualList from './lib/VirtualList'",
  props: [
    { name: 'items', type: 'T[]', required: true, description: 'Arreglo de items a renderizar. Puede tener miles de elementos.' },
    { name: 'itemHeight', type: 'number', required: true, description: 'Altura fija en px de cada fila. Debe ser uniforme.' },
    { name: 'height', type: 'number', required: true, description: 'Altura total del contenedor de scroll en px.' },
    { name: 'renderItem', type: '(item: T, index: number) => ReactNode', required: true, description: 'Función que renderiza cada fila.' },
    { name: 'overscan', type: 'number', default: '4', description: 'Filas extra renderizadas fuera del viewport para reducir parpadeo al scrollear.' },
  ],
  events: [],
  notes: [
    'El componente es genérico: <VirtualList<MiTipo> ...> inferido o anotado.',
    'itemHeight debe ser constante — el componente no mide el DOM.',
    'Requiere que el padre tenga ancho definido para que las filas se ajusten.',
  ],
  examples: [
    {
      title: '1000 elementos',
      description: 'Lista de mil filas con altura 44px y viewport de 260px.',
      node: <VirtualBasicDemo />,
      code: `const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: \`Elemento #\${i+1}\` }))

<VirtualList
  items={items}
  itemHeight={44}
  height={260}
  renderItem={(item) => <div>{item.name}</div>}
/>`,
    },
    {
      title: 'Items con estado',
      description: 'Cada fila muestra un indicador de estado. 500 items con overscan=6.',
      node: <VirtualCustomDemo />,
      code: `<VirtualList
  items={tasks}
  itemHeight={38}
  height={200}
  overscan={6}
  renderItem={(item) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ background: item.done ? 'var(--success,#34D17E)' : 'var(--subtle-foreground,#6B7480)' }} />
      {item.label}
    </div>
  )}
/>`,
    },
  ],
}

const sparklineEntry: DocEntry = {
  slug: 'sparkline',
  name: 'Sparkline',
  category: 'Datos',
  description: 'Mini gráfico SVG inline. Tipo línea con relleno opcional o barras. Escala automática, sin ejes, pensado para dashboards y tablas.',
  importLine: "import Sparkline from './lib/Sparkline'",
  props: [
    { name: 'data', type: 'number[]', required: true, description: 'Serie de valores numéricos a graficar.' },
    { name: 'width', type: 'number', default: '120', description: 'Ancho del SVG en px.' },
    { name: 'height', type: 'number', default: '32', description: 'Alto del SVG en px.' },
    { name: 'color', type: 'string', default: 'var(--primary,#C9A24B)', description: 'Color de línea/barras. Acepta cualquier CSS color o var().' },
    { name: 'type', type: "'line' | 'bar'", default: "'line'", description: 'Tipo de visualización.' },
    { name: 'fill', type: 'boolean', default: 'false', description: 'En tipo línea, rellena el área bajo la curva con opacidad reducida.' },
  ],
  events: [],
  notes: [
    'El SVG escala automáticamente min→max al alto disponible con 2px de padding vertical.',
    'Con un único punto, se muestra como un punto centrado verticalmente.',
    'Sin ejes ni labels: ideal para combinar dentro de celdas de tabla o stat cards.',
  ],
  examples: [
    {
      title: 'Variantes de estilo',
      description: 'Línea con relleno, línea sin relleno y barras.',
      node: <SparklineVariantsDemo />,
      code: `<Sparkline data={data} type="line" fill color="var(--primary,#C9A24B)" />
<Sparkline data={data} type="line" color="var(--destructive,#E5604D)" />
<Sparkline data={data} type="bar" color="var(--success,#34D17E)" />`,
    },
    {
      title: 'Tamaños',
      description: 'El SVG se ajusta al width/height indicado.',
      node: <SparklineSizesDemo />,
      code: `<Sparkline data={data} width={80} height={24} type="line" fill />
<Sparkline data={data} width={200} height={48} type="bar" />`,
    },
    {
      title: 'Datos planos',
      description: 'Cuando todos los valores son iguales, la línea va al centro.',
      node: <SparklineFlatDemo />,
      code: `<Sparkline data={[10,10,10,10,10,10]} color="var(--subtle-foreground,#6B7480)" />`,
    },
  ],
}

const statisticEntry: DocEntry = {
  slug: 'statistic',
  name: 'Statistic',
  category: 'Datos',
  description: 'Métrica destacada con número grande Archivo 900, prefijo/sufijo, animación count-up con requestAnimationFrame y tendencia coloreada.',
  importLine: "import Statistic from './lib/Statistic'",
  props: [
    { name: 'label', type: 'string', required: true, description: 'Etiqueta descriptiva sobre el número.' },
    { name: 'value', type: 'number', required: true, description: 'Valor numérico a mostrar.' },
    { name: 'prefix', type: 'string', description: 'Texto antes del número (ej: "$").' },
    { name: 'suffix', type: 'string', description: 'Texto después del número (ej: "%").' },
    { name: 'decimals', type: 'number', default: '0', description: 'Cantidad de decimales a mostrar.' },
    { name: 'countUp', type: 'boolean', default: 'false', description: 'Si es true, anima de 0 al valor al montar con ease-out cúbico.' },
    { name: 'trend', type: '{ value: number; direction: "up" | "down" }', description: 'Indicador de tendencia: up = verde (go), down = rojo (danger).' },
  ],
  events: [],
  notes: [
    'La animación countUp usa requestAnimationFrame con ease-out cúbico, 1 segundo de duración.',
    'Al cambiar value con countUp=true se reinicia la animación desde 0.',
    'El cleanup del RAF se hace en el useEffect para evitar memory leaks.',
  ],
  examples: [
    {
      title: 'Métricas básicas',
      description: 'Con prefijo, sufijo y distintos decimales.',
      node: <StatisticBasicDemo />,
      code: `<Statistic label="Ingresos totales" value={128450} prefix="$" decimals={0} />
<Statistic label="Tasa de conversión" value={4.73} suffix="%" decimals={2} />`,
    },
    {
      title: 'Animación count-up',
      description: 'El número se anima desde 0 al montar. Hacé clic para reiniciar.',
      node: <StatisticCountUpDemo />,
      code: `<Statistic label="Ventas del mes" value={87200} prefix="$" countUp />`,
    },
    {
      title: 'Con tendencia',
      description: 'Flecha y porcentaje coloreado según dirección.',
      node: <StatisticTrendDemo />,
      code: `<Statistic
  label="Nuevos clientes"
  value={542}
  countUp
  trend={{ value: 12.4, direction: 'up' }}
/>`,
    },
  ],
}

const resultEntry: DocEntry = {
  slug: 'result',
  name: 'Result',
  category: 'Feedback',
  description: 'Pantalla de resultado centrada con ícono circular tintado, título Archivo 900, descripción en ink2 y slot de acciones. Cinco estados: success, error, info, warning, empty.',
  importLine: "import Result from './lib/Result'",
  props: [
    { name: 'status', type: "'success' | 'error' | 'info' | 'warning' | 'empty'", required: true, description: 'Determina el color e ícono del resultado.' },
    { name: 'title', type: 'string', required: true, description: 'Título principal del resultado.' },
    { name: 'description', type: 'string', description: 'Texto explicativo bajo el título.' },
    { name: 'actions', type: 'ReactNode', description: 'Slot libre para botones u otras acciones.' },
  ],
  events: [],
  notes: [
    'El color de info usa --primary (gold) en lugar de azul para coherencia con la paleta Palqueate.',
    'El slot actions se centra automáticamente con flexbox wrap.',
    'Para páginas de error 404/500, combinar con el layout de la app — este componente no tiene altura de viewport.',
  ],
  examples: [
    {
      title: 'Pago exitoso',
      node: <ResultSuccessDemo />,
      code: `<Result
  status="success"
  title="¡Pago procesado!"
  description="Tu compra fue confirmada."
  actions={<Btn label="Ver pedido" variant="primary" />}
/>`,
    },
    {
      title: 'Error con acciones',
      node: <ResultErrorDemo />,
      code: `<Result
  status="error"
  title="No se pudo procesar"
  description="Revisá los datos e intentá de nuevo."
  actions={<><Btn label="Reintentar" variant="danger" /><Btn label="Cancelar" variant="ghost" /></>}
/>`,
    },
    {
      title: 'Todos los estados',
      description: 'success, error, info, warning y empty.',
      node: <ResultAllStatusDemo />,
      code: `<Result status="success" title="Operación exitosa" />
<Result status="error" title="Algo falló" />
<Result status="info" title="Información importante" />
<Result status="warning" title="Atención requerida" />
<Result status="empty" title="Nada por aquí" />`,
    },
  ],
}

const codeEntry: DocEntry = {
  slug: 'code',
  name: 'Code',
  category: 'Datos',
  description: 'Bloque de código con tipografía Space Mono, fondo bg, chip de lenguaje opcional y botón de copia con feedback visual de 1.5 segundos.',
  importLine: "import Code from './lib/Code'",
  props: [
    { name: 'code', type: 'string', required: true, description: 'Contenido del bloque de código.' },
    { name: 'language', type: 'string', description: 'Etiqueta del lenguaje mostrada en el chip superior (tsx, json, bash, etc).' },
    { name: 'copyable', type: 'boolean', default: 'true', description: 'Muestra el botón de copiar al portapapeles.' },
  ],
  events: [],
  notes: [
    'No hay syntax highlighting: el componente es intencional en no depender de librerías externas.',
    'El botón de copia usa navigator.clipboard — requiere HTTPS o localhost.',
    'El feedback visual ("copiado") dura 1.5 segundos y luego vuelve al estado original.',
  ],
  examples: [
    {
      title: 'Con lenguaje y copia',
      node: <CodeBasicDemo />,
      code: `<Code code={snippet} language="tsx" copyable />`,
    },
    {
      title: 'Sin botón de copia',
      node: <CodeNoCopyDemo />,
      code: `<Code code={json} language="json" copyable={false} />`,
    },
    {
      title: 'Comando de terminal',
      description: 'Sin chip de lenguaje, solo la barra con el botón de copia.',
      node: <CodeNoLangDemo />,
      code: `<Code code="npm install palqueate" />`,
    },
    {
      title: 'Sin barra superior',
      description: 'Sin language ni copyable, solo el pre.',
      node: <Code code="const x = 42" copyable={false} />,
      code: `<Code code="const x = 42" copyable={false} />`,
    },
  ],
}

const entries: DocEntry[] = [treeEntry, virtualListEntry, sparklineEntry, statisticEntry, resultEntry, codeEntry]
export default entries
