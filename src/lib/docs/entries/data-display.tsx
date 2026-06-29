import { useState } from 'react'
import type { DocEntry } from '../types'
import {
  Badge, Chip, Tag, Avatar, AvatarGroup, StatusDot, Kbd, StatTile, DescriptionList, Rating,
} from '../../index'
import { CheckIcon, StarIcon, HeartIcon, BellIcon, TagIcon } from '@heroicons/react/24/outline'

// ---------------------------------------------------------------------------
// Interactive demo components
// ---------------------------------------------------------------------------

function ChipFilterDemo() {
  const options = ['Todos', 'Activos', 'Pausados', 'Archivados']
  const [selected, setSelected] = useState('Todos')
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {options.map(opt => (
        <Chip key={opt} active={selected === opt} onClick={() => setSelected(opt)}>
          {opt}
        </Chip>
      ))}
    </div>
  )
}

function ChipMultiDemo() {
  const tags = ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Docker']
  const [active, setActive] = useState<Set<string>>(new Set(['React', 'TypeScript']))
  function toggle(t: string) {
    setActive(prev => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })
  }
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {tags.map(t => (
        <Chip key={t} active={active.has(t)} onClick={() => toggle(t)}>
          {t}
        </Chip>
      ))}
    </div>
  )
}

function RatingEditableDemo() {
  const [val, setVal] = useState(3)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Rating value={val} editable onChange={setVal} />
      <span style={{ fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
        {val} / 5
      </span>
    </div>
  )
}

function RatingHalfDemo() {
  const [val, setVal] = useState(3.5)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Rating value={val} editable allowHalf onChange={setVal} />
      <span style={{ fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
        {val} / 5
      </span>
    </div>
  )
}

const HEART_PATH = 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'

function RatingHeartDemo() {
  const [val, setVal] = useState(2)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Rating value={val} editable allowHalf iconPath={HEART_PATH} color="var(--destructive,#E5604D)" onChange={setVal} />
      <span style={{ fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
        {val} / 5
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Entries
// ---------------------------------------------------------------------------

const badge: DocEntry = {
  slug: 'badge',
  name: 'Badge',
  category: 'Datos',
  description: 'Etiqueta de estado compacta. Cinco tonos semánticos, variante sólida y punto leading para indicar presencia o actividad.',
  importLine: "import { Badge } from './lib'",
  props: [
    { name: 'children', type: 'ReactNode', description: 'Texto o nodo a mostrar dentro de la insignia.' },
    { name: 'tone', type: "'neutral' | 'brand' | 'success' | 'danger' | 'warn'", default: "'neutral'", description: 'Color semántico de la insignia.' },
    { name: 'solid', type: 'boolean', default: 'false', description: 'Fondo sólido en lugar del tinte suave por defecto.' },
    { name: 'dot', type: 'boolean', default: 'false', description: 'Muestra un punto leading — útil para estados disponible/pausado.' },
  ],
  examples: [
    {
      title: 'Tonos',
      description: 'Los cinco tonos semánticos en su variante soft (por defecto).',
      node: (
        <>
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="brand">Brand</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="warn">Warning</Badge>
        </>
      ),
      code: `<Badge tone="neutral">Neutral</Badge>\n<Badge tone="brand">Brand</Badge>\n<Badge tone="success">Success</Badge>\n<Badge tone="danger">Danger</Badge>\n<Badge tone="warn">Warning</Badge>`,
    },
    {
      title: 'Solid',
      description: 'Fondo sólido con color de texto invertido.',
      node: (
        <>
          <Badge tone="neutral" solid>Neutral</Badge>
          <Badge tone="brand" solid>Brand</Badge>
          <Badge tone="success" solid>Success</Badge>
          <Badge tone="danger" solid>Danger</Badge>
          <Badge tone="warn" solid>Warning</Badge>
        </>
      ),
      code: '<Badge tone="success" solid>Success</Badge>',
    },
    {
      title: 'Con punto leading',
      description: 'Agrega un círculo de color antes del texto — ideal para estados de disponibilidad.',
      node: (
        <>
          <Badge tone="success" dot>Disponible</Badge>
          <Badge tone="danger" dot>Ocupado</Badge>
          <Badge tone="neutral" dot>Offline</Badge>
          <Badge tone="warn" dot>Pendiente</Badge>
        </>
      ),
      code: '<Badge tone="success" dot>Disponible</Badge>',
    },
    {
      title: 'Solid con punto',
      description: 'El punto hereda el color del texto invertido cuando solid está activo.',
      node: (
        <>
          <Badge tone="success" solid dot>Online</Badge>
          <Badge tone="danger" solid dot>Bloqueado</Badge>
          <Badge tone="brand" solid dot>Pro</Badge>
        </>
      ),
      code: '<Badge tone="success" solid dot>Online</Badge>',
    },
    {
      title: 'Casos de uso reales',
      description: 'Combinaciones típicas en listas, tablas y tarjetas.',
      node: (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge tone="success">Activo</Badge>
          <Badge tone="danger">Cancelado</Badge>
          <Badge tone="warn">En revisión</Badge>
          <Badge tone="brand" solid>Premium</Badge>
          <Badge tone="neutral">Draft</Badge>
          <Badge tone="success" dot>En vivo</Badge>
        </div>
      ),
    },
  ],
}

const chip: DocEntry = {
  slug: 'chip',
  name: 'Chip',
  category: 'Datos',
  description: 'Filtro interactivo tipo pill. Admite estado activo con acento brand y se deshabilita limpiamente. Ideal para grupos de filtros y selección rápida.',
  importLine: "import { Chip } from './lib'",
  props: [
    { name: 'children', type: 'ReactNode', description: 'Contenido del chip — texto, ícono o ambos.' },
    { name: 'active', type: 'boolean', default: 'false', description: 'Estado seleccionado. Rellena con el acento brand.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el chip y baja su opacidad.' },
  ],
  events: [
    { name: 'onClick', type: '() => void', description: 'Se dispara al hacer clic (salvo disabled).' },
  ],
  examples: [
    {
      title: 'Estados básicos',
      description: 'Inactivo, activo y deshabilitado.',
      node: (
        <>
          <Chip>Inactivo</Chip>
          <Chip active>Activo</Chip>
          <Chip disabled>Deshabilitado</Chip>
        </>
      ),
      code: `<Chip>Inactivo</Chip>\n<Chip active>Activo</Chip>\n<Chip disabled>Deshabilitado</Chip>`,
    },
    {
      title: 'Filtro de selección única',
      description: 'Solo un chip puede estar activo a la vez.',
      node: <ChipFilterDemo />,
      code: `const [selected, setSelected] = useState('Todos')\n// ...\n<Chip active={selected === opt} onClick={() => setSelected(opt)}>{opt}</Chip>`,
    },
    {
      title: 'Multi-selección',
      description: 'Varios chips pueden estar activos simultáneamente.',
      node: <ChipMultiDemo />,
      code: `const [active, setActive] = useState(new Set(['React']))\n<Chip active={active.has(t)} onClick={() => toggle(t)}>{t}</Chip>`,
    },
    {
      title: 'Con ícono',
      description: 'El slot children acepta cualquier nodo — combiná texto e íconos.',
      node: (
        <>
          <Chip active>
            <CheckIcon style={{ width: '14px', height: '14px' }} />
            Verificado
          </Chip>
          <Chip>
            <BellIcon style={{ width: '14px', height: '14px' }} />
            Alertas
          </Chip>
          <Chip>
            <TagIcon style={{ width: '14px', height: '14px' }} />
            Etiquetas
          </Chip>
        </>
      ),
      code: `<Chip active>\n  <CheckIcon style={{ width: '14px', height: '14px' }} />\n  Verificado\n</Chip>`,
    },
    {
      title: 'Deshabilitados en grupo',
      description: 'Chips no disponibles mantienen su estructura visual con opacidad reducida.',
      node: (
        <>
          <Chip active disabled>Seleccionado</Chip>
          <Chip disabled>No disponible</Chip>
        </>
      ),
    },
  ],
}

const tag: DocEntry = {
  slug: 'tag',
  name: 'Tag',
  category: 'Datos',
  description: 'Token compacto removible. Perfecto para filtros activos, ítems seleccionados y listas de etiquetas editables. El botón × dispara onRemove.',
  importLine: "import { Tag } from './lib'",
  props: [
    { name: 'children', type: 'ReactNode', description: 'Texto o nodo dentro del tag.' },
    { name: 'onRemove', type: '() => void', description: 'Cuando se define, aparece el botón × y dispara esta función al hacer clic.' },
  ],
  examples: [
    {
      title: 'Sin remover',
      description: 'Tag estático, solo lectura.',
      node: (
        <>
          <Tag>React</Tag>
          <Tag>TypeScript</Tag>
          <Tag>Next.js</Tag>
        </>
      ),
      code: `<Tag>React</Tag>`,
    },
    {
      title: 'Con botón remover',
      description: 'El padding derecho se ajusta automáticamente cuando onRemove está presente.',
      node: (
        <>
          <Tag onRemove={() => {}}>Diseño UI</Tag>
          <Tag onRemove={() => {}}>Accesibilidad</Tag>
          <Tag onRemove={() => {}}>Performance</Tag>
        </>
      ),
      code: `<Tag onRemove={() => handleRemove('Diseño UI')}>Diseño UI</Tag>`,
    },
    {
      title: 'Filtros activos',
      description: 'Caso clásico: mostrar y eliminar filtros aplicados.',
      node: (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <Tag onRemove={() => {}}>Estado: Activo</Tag>
          <Tag onRemove={() => {}}>Ciudad: Buenos Aires</Tag>
          <Tag onRemove={() => {}}>Plan: Pro</Tag>
        </div>
      ),
      code: `<Tag onRemove={() => clearFilter('estado')}>Estado: Activo</Tag>`,
    },
    {
      title: 'Lista de habilidades',
      description: 'Tags mezclando modo lectura y modo removible.',
      node: (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <Tag>Figma</Tag>
          <Tag>Illustrator</Tag>
          <Tag onRemove={() => {}}>Sketch</Tag>
        </div>
      ),
    },
    {
      title: 'Con ícono leading',
      description: 'El children acepta cualquier nodo — combiná íconos con texto.',
      node: (
        <>
          <Tag onRemove={() => {}}>
            <HeartIcon style={{ width: '12px', height: '12px' }} />
            Favorito
          </Tag>
          <Tag onRemove={() => {}}>
            <StarIcon style={{ width: '12px', height: '12px' }} />
            Destacado
          </Tag>
        </>
      ),
      code: `<Tag onRemove={() => {}}>\n  <HeartIcon style={{ width: '12px', height: '12px' }} />\n  Favorito\n</Tag>`,
    },
  ],
}

const avatar: DocEntry = {
  slug: 'avatar',
  name: 'Avatar',
  category: 'Datos',
  description: 'Representación visual de un usuario. Muestra la imagen cuando src está disponible; si no, genera iniciales a partir del nombre. Admite forma circular o cuadrada.',
  importLine: "import { Avatar } from './lib'",
  props: [
    { name: 'src', type: 'string', description: 'URL de la imagen. Si no se provee o falla la carga, se generan iniciales.' },
    { name: 'name', type: 'string', default: "''", description: 'Nombre completo del usuario. Se usa para generar las iniciales y como alt text.' },
    { name: 'size', type: 'number', default: '40', description: 'Ancho y alto en píxeles.' },
    { name: 'square', type: 'boolean', default: 'false', description: 'Usa border-radius proporcional al tamaño en lugar de 50%. Aspecto más "tile".' },
  ],
  examples: [
    {
      title: 'Con imagen',
      description: 'Cuando src está presente se muestra la foto con borde sutil.',
      node: (
        <>
          <Avatar src="https://i.pravatar.cc/80?img=1" name="Ana García" />
          <Avatar src="https://i.pravatar.cc/80?img=5" name="Carlos López" />
          <Avatar src="https://i.pravatar.cc/80?img=9" name="María Torres" />
        </>
      ),
      code: `<Avatar src="https://i.pravatar.cc/80?img=1" name="Ana García" />`,
    },
    {
      title: 'Fallback a iniciales',
      description: 'Sin src se generan hasta dos iniciales del nombre.',
      node: (
        <>
          <Avatar name="Ana García" />
          <Avatar name="Carlos López" />
          <Avatar name="María Torres" />
          <Avatar name="J" />
        </>
      ),
      code: `<Avatar name="Ana García" />`,
    },
    {
      title: 'Tamaños',
      description: 'El prop size controla ancho, alto y tamaño de fuente proporcional.',
      node: (
        <>
          <Avatar name="Ana García" size={24} />
          <Avatar name="Ana García" size={32} />
          <Avatar name="Ana García" size={40} />
          <Avatar name="Ana García" size={56} />
          <Avatar name="Ana García" size={72} />
        </>
      ),
      code: `<Avatar name="Ana García" size={56} />`,
    },
    {
      title: 'Forma cuadrada',
      description: 'square=true aplica border-radius proporcional — ideal para bots y organizaciones.',
      node: (
        <>
          <Avatar name="Palqueate" square />
          <Avatar src="https://i.pravatar.cc/80?img=3" name="Org" square size={48} />
          <Avatar name="AI Bot" square size={48} />
        </>
      ),
      code: `<Avatar name="Palqueate" square />`,
    },
    {
      title: 'Nombre de una sola palabra',
      description: 'Con una sola palabra se toman las dos primeras letras.',
      node: (
        <>
          <Avatar name="Juan" />
          <Avatar name="Antropic" />
          <Avatar name="X" />
        </>
      ),
    },
  ],
}

const avatarGroup: DocEntry = {
  slug: 'avatar-group',
  name: 'AvatarGroup',
  category: 'Datos',
  description: 'Stack de avatares superpuestos con contador de desborde "+N". El overlap es proporcional al tamaño para que siempre se vea bien.',
  importLine: "import { AvatarGroup } from './lib'",
  props: [
    { name: 'people', type: 'Array<{ name?: string; src?: string }>', default: '[]', description: 'Lista de personas a mostrar. Cada ítem acepta name y/o src.' },
    { name: 'max', type: 'number', default: '4', description: 'Cantidad máxima de avatares visibles antes del contador "+N".' },
    { name: 'size', type: 'number', default: '36', description: 'Tamaño de cada avatar en píxeles.' },
  ],
  examples: [
    {
      title: 'Básico',
      description: 'Cuatro personas, todas visibles.',
      node: (
        <AvatarGroup people={[
          { name: 'Ana García' },
          { name: 'Carlos López' },
          { name: 'María Torres' },
          { name: 'Juan Pérez' },
        ]} />
      ),
      code: `<AvatarGroup people={[\n  { name: 'Ana García' },\n  { name: 'Carlos López' },\n  { name: 'María Torres' },\n  { name: 'Juan Pérez' },\n]} />`,
    },
    {
      title: 'Con desborde',
      description: 'Cuando el total supera max se muestra el contador "+N".',
      node: (
        <AvatarGroup
          people={[
            { name: 'Ana García' },
            { name: 'Carlos López' },
            { name: 'María Torres' },
            { name: 'Juan Pérez' },
            { name: 'Lucía Romero' },
            { name: 'Diego Fernández' },
            { name: 'Valentina Cruz' },
          ]}
          max={4}
        />
      ),
      code: `<AvatarGroup people={sevenPeople} max={4} />`,
    },
    {
      title: 'max personalizado',
      description: 'Reducí max para comprimir equipos grandes.',
      node: (
        <>
          <AvatarGroup people={[
            { name: 'Ana García' }, { name: 'Carlos López' }, { name: 'María Torres' },
            { name: 'Juan Pérez' }, { name: 'Lucía Romero' },
          ]} max={2} />
          <AvatarGroup people={[
            { name: 'Ana García' }, { name: 'Carlos López' }, { name: 'María Torres' },
            { name: 'Juan Pérez' }, { name: 'Lucía Romero' },
          ]} max={5} />
        </>
      ),
      code: `<AvatarGroup people={fivePeople} max={2} />`,
    },
    {
      title: 'Tamaños',
      description: 'El overlap se recalcula automáticamente por tamaño.',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AvatarGroup people={[{ name: 'Ana García' }, { name: 'Carlos López' }, { name: 'María Torres' }]} size={24} />
          <AvatarGroup people={[{ name: 'Ana García' }, { name: 'Carlos López' }, { name: 'María Torres' }]} size={36} />
          <AvatarGroup people={[{ name: 'Ana García' }, { name: 'Carlos López' }, { name: 'María Torres' }]} size={52} />
        </div>
      ),
      code: `<AvatarGroup people={threePeople} size={52} />`,
    },
    {
      title: 'Con fotos reales',
      description: 'Mezclando src e iniciales — cuando src falla cae al fallback.',
      node: (
        <AvatarGroup
          people={[
            { name: 'Ana García', src: 'https://i.pravatar.cc/80?img=1' },
            { name: 'Carlos López', src: 'https://i.pravatar.cc/80?img=5' },
            { name: 'María Torres' },
            { name: 'Juan Pérez' },
            { name: 'Lucía Romero', src: 'https://i.pravatar.cc/80?img=9' },
          ]}
        />
      ),
    },
  ],
}

const statusDot: DocEntry = {
  slug: 'status-dot',
  name: 'StatusDot',
  category: 'Datos',
  description: 'Indicador de estado con punto de color y label opcional. Cuatro estados semánticos y animación pulse para estados en vivo.',
  importLine: "import { StatusDot } from './lib'",
  props: [
    { name: 'status', type: "'online' | 'busy' | 'offline' | 'brand'", default: "'online'", description: 'Color semántico del punto.' },
    { name: 'label', type: 'ReactNode', description: 'Texto o nodo mostrado a la derecha del punto.' },
    { name: 'pulse', type: 'boolean', default: 'false', description: 'Agrega un anillo pulsante alrededor del punto — ideal para estados en vivo.' },
  ],
  examples: [
    {
      title: 'Cuatro estados',
      description: 'Online (verde), busy (rojo), offline (gris) y brand (acento).',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <StatusDot status="online" label="En línea" />
          <StatusDot status="busy" label="Ocupado" />
          <StatusDot status="offline" label="Desconectado" />
          <StatusDot status="brand" label="En revisión" />
        </div>
      ),
      code: `<StatusDot status="online" label="En línea" />\n<StatusDot status="busy" label="Ocupado" />\n<StatusDot status="offline" label="Desconectado" />`,
    },
    {
      title: 'Solo punto (sin label)',
      description: 'Sin label el dot se usa inline, por ejemplo junto a un avatar.',
      node: (
        <>
          <StatusDot status="online" />
          <StatusDot status="busy" />
          <StatusDot status="offline" />
          <StatusDot status="brand" />
        </>
      ),
      code: `<StatusDot status="online" />`,
    },
    {
      title: 'Pulse — en vivo',
      description: 'El ring pulsante llama la atención sobre estados activos o en progreso.',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <StatusDot status="online" label="Transmitiendo en vivo" pulse />
          <StatusDot status="brand" label="Procesando" pulse />
          <StatusDot status="busy" label="Incidente activo" pulse />
        </div>
      ),
      code: `<StatusDot status="online" label="Transmitiendo en vivo" pulse />`,
    },
    {
      title: 'Con label como nodo',
      description: 'El prop label acepta cualquier ReactNode — combiná texto y texto secundario.',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <StatusDot status="online" label={
            <span style={{ fontFamily: 'Archivo', fontWeight: 700 }}>
              Ana García{' '}
              <span style={{ fontWeight: 400, color: 'var(--subtle-foreground,#6B7480)' }}>· Diseñadora</span>
            </span>
          } />
          <StatusDot status="busy" label={
            <span style={{ fontFamily: 'Archivo', fontWeight: 700 }}>
              Carlos López{' '}
              <span style={{ fontWeight: 400, color: 'var(--subtle-foreground,#6B7480)' }}>· Dev</span>
            </span>
          } />
        </div>
      ),
    },
  ],
}

const kbd: DocEntry = {
  slug: 'kbd',
  name: 'Kbd',
  category: 'Datos',
  description: 'Tecla de teclado estilizada para hints de atajos. Monoespaciado, borde inferior doble para efecto 3D, tamaño compacto que se integra en cualquier texto.',
  importLine: "import { Kbd } from './lib'",
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Texto de la tecla — puede ser una letra, símbolo o combinación.' },
  ],
  notes: [
    'Kbd no tiene variantes ni tamaños configurables — el tamaño es fijo y se integra bien con texto de 13–14px.',
    'Para combinar teclas, renderizá múltiples Kbd con un separador "+" entre ellos.',
  ],
  examples: [
    {
      title: 'Teclas individuales',
      description: 'Letras, modificadores y teclas especiales.',
      node: (
        <>
          <Kbd>⌘</Kbd>
          <Kbd>⌥</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>Ctrl</Kbd>
          <Kbd>Alt</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>↵</Kbd>
        </>
      ),
      code: `<Kbd>⌘</Kbd>\n<Kbd>Ctrl</Kbd>\n<Kbd>Esc</Kbd>`,
    },
    {
      title: 'Combinaciones',
      description: 'Separadores entre múltiples Kbd para atajos compuestos.',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
            <Kbd>⌘</Kbd><span>+</span><Kbd>K</Kbd>
            <span style={{ marginLeft: '8px' }}>Paleta de comandos</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
            <Kbd>⌘</Kbd><span>+</span><Kbd>⇧</Kbd><span>+</span><Kbd>P</Kbd>
            <span style={{ marginLeft: '8px' }}>Publicar</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
            <Kbd>Ctrl</Kbd><span>+</span><Kbd>Z</Kbd>
            <span style={{ marginLeft: '8px' }}>Deshacer</span>
          </span>
        </div>
      ),
      code: `<Kbd>⌘</Kbd><span>+</span><Kbd>K</Kbd>`,
    },
    {
      title: 'Inline en texto',
      description: 'Kbd se integra naturalmente en párrafos de ayuda.',
      node: (
        <p style={{ fontFamily: 'Archivo', fontSize: '14px', color: 'var(--muted-foreground,#9AA6B2)', margin: 0 }}>
          Presioná <Kbd>⌘</Kbd>+<Kbd>S</Kbd> para guardar o <Kbd>Esc</Kbd> para cancelar.
        </p>
      ),
      code: `<p>Presioná <Kbd>⌘</Kbd>+<Kbd>S</Kbd> para guardar.</p>`,
    },
    {
      title: 'Tabla de atajos',
      description: 'Layout típico de panel de shortcuts.',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { keys: ['⌘', 'N'], desc: 'Nuevo evento' },
            { keys: ['⌘', '⇧', 'F'], desc: 'Buscar en todo' },
            { keys: ['⌘', ','], desc: 'Preferencias' },
            { keys: ['?'], desc: 'Ver todos los atajos' },
          ].map(({ keys, desc }) => (
            <div key={desc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>{desc}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {keys.map((k, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {i > 0 && <span style={{ fontFamily: 'Archivo', fontSize: '11px', color: 'var(--subtle-foreground,#6B7480)' }}>+</span>}
                    <Kbd>{k}</Kbd>
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      ),
    },
  ],
}

const statTile: DocEntry = {
  slug: 'stat-tile',
  name: 'StatTile',
  category: 'Datos',
  description: 'Tarjeta de métrica compacta con label, valor principal, subtexto opcional e ícono de estrella. El borde se resalta con el acento brand cuando accent está activo.',
  importLine: "import { StatTile } from './lib'",
  props: [
    {
      name: 'data',
      type: '{ label?: string; value?: string | number; sub?: string; icon?: string; accent?: boolean }',
      required: true,
      description: 'Objeto con todos los datos del tile. Ningún campo es obligatorio individualmente.',
    },
  ],
  notes: [
    'El único valor soportado para data.icon es "star" — muestra un ícono de estrella con color brand antes del label.',
    'El value usa clamp(20px, 2.5vw, 26px) — escala automáticamente con el viewport.',
  ],
  examples: [
    {
      title: 'Básico',
      description: 'Label y valor numérico.',
      node: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '400px' }}>
          <StatTile data={{ label: 'USUARIOS', value: '12.4k' }} />
          <StatTile data={{ label: 'INGRESOS', value: '$84,200' }} />
        </div>
      ),
      code: `<StatTile data={{ label: 'USUARIOS', value: '12.4k' }} />`,
    },
    {
      title: 'Con subtexto',
      description: 'sub muestra una línea adicional debajo del valor principal.',
      node: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '400px' }}>
          <StatTile data={{ label: 'CONVERSIONES', value: '8.3%', sub: '+1.2% vs. mes anterior' }} />
          <StatTile data={{ label: 'TICKET MEDIO', value: '$240', sub: '↑ desde $198' }} />
        </div>
      ),
      code: `<StatTile data={{ label: 'CONVERSIONES', value: '8.3%', sub: '+1.2% vs. mes anterior' }} />`,
    },
    {
      title: 'Accent (borde brand)',
      description: 'accent=true resalta el borde con el color brand — útil para la métrica más importante.',
      node: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '400px' }}>
          <StatTile data={{ label: 'RATING', value: '4.9', sub: '2.1k reseñas', icon: 'star', accent: true }} />
          <StatTile data={{ label: 'NPS', value: '72', sub: 'Promotores: 68%' }} />
        </div>
      ),
      code: `<StatTile data={{ label: 'RATING', value: '4.9', icon: 'star', accent: true }} />`,
    },
    {
      title: 'Con ícono de estrella',
      description: 'icon: "star" agrega un ícono brand antes del label.',
      node: (
        <div style={{ maxWidth: '200px' }}>
          <StatTile data={{ label: 'PUNTUACIÓN', value: '4.7', sub: '843 valoraciones', icon: 'star', accent: true }} />
        </div>
      ),
      code: `<StatTile data={{ label: 'PUNTUACIÓN', value: '4.7', icon: 'star' }} />`,
    },
    {
      title: 'Grid de métricas',
      description: 'Combinación real de tiles para un dashboard.',
      node: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <StatTile data={{ label: 'EVENTOS', value: '1,284', sub: 'Este mes' }} />
          <StatTile data={{ label: 'ASISTENTES', value: '48.7k', sub: '+12% ↑' }} />
          <StatTile data={{ label: 'RATING', value: '4.9', sub: '6.2k reseñas', icon: 'star', accent: true }} />
        </div>
      ),
    },
  ],
}

const descriptionList: DocEntry = {
  slug: 'description-list',
  name: 'DescriptionList',
  category: 'Datos',
  description: 'Lista de pares clave/valor con separadores. Ideal para recibos, paneles de detalle, resúmenes de orden y metadata de entidad.',
  importLine: "import { DescriptionList } from './lib'",
  props: [
    {
      name: 'items',
      type: 'Array<{ term: string; value: ReactNode }>',
      default: '[]',
      description: 'Pares a renderizar. term es el label izquierdo; value es el contenido derecho (acepta cualquier ReactNode).',
    },
  ],
  notes: [
    'El primer ítem nunca tiene borde superior — los demás se separan automáticamente.',
    'value acepta ReactNode: podés pasar un Badge, un StatusDot o cualquier otro componente como valor.',
  ],
  examples: [
    {
      title: 'Resumen de orden',
      description: 'Caso clásico: factura o checkout.',
      node: (
        <div style={{ maxWidth: '380px' }}>
          <DescriptionList items={[
            { term: 'Subtotal', value: '$1,200.00' },
            { term: 'Descuento (10%)', value: '−$120.00' },
            { term: 'Impuestos', value: '$108.00' },
            { term: 'Envío', value: 'Gratis' },
            { term: 'Total', value: '$1,188.00' },
          ]} />
        </div>
      ),
      code: `<DescriptionList items={[\n  { term: 'Subtotal', value: '$1,200.00' },\n  { term: 'Total', value: '$1,188.00' },\n]} />`,
    },
    {
      title: 'Detalle de perfil',
      description: 'Información de cuenta con campos mixtos.',
      node: (
        <div style={{ maxWidth: '400px' }}>
          <DescriptionList items={[
            { term: 'Nombre', value: 'Ana García' },
            { term: 'Email', value: 'ana@palqueate.com' },
            { term: 'Plan', value: 'Pro' },
            { term: 'Miembro desde', value: 'Marzo 2023' },
          ]} />
        </div>
      ),
    },
    {
      title: 'Valores como componentes',
      description: 'El campo value es ReactNode — podés pasar Badge, StatusDot, etc.',
      node: (
        <div style={{ maxWidth: '380px' }}>
          <DescriptionList items={[
            { term: 'Estado', value: <Badge tone="success" dot>Activo</Badge> },
            { term: 'Verificado', value: <Badge tone="brand" solid>Pro</Badge> },
            { term: 'Conexión', value: <StatusDot status="online" label="En línea" /> },
          ]} />
        </div>
      ),
      code: `{ term: 'Estado', value: <Badge tone="success" dot>Activo</Badge> }`,
    },
    {
      title: 'Metadata de evento',
      description: 'Detalles técnicos de una entidad.',
      node: (
        <div style={{ maxWidth: '400px' }}>
          <DescriptionList items={[
            { term: 'ID', value: 'evt_8f2k3p' },
            { term: 'Creado', value: '25 jun 2026, 14:32' },
            { term: 'Modificado', value: 'Hace 3 horas' },
            { term: 'Versión', value: 'v2.1.0' },
            { term: 'Región', value: 'us-east-1' },
          ]} />
        </div>
      ),
    },
    {
      title: 'Lista mínima (un ítem)',
      description: 'El primer ítem nunca recibe borde superior.',
      node: (
        <div style={{ maxWidth: '300px' }}>
          <DescriptionList items={[{ term: 'Duración', value: '2h 30m' }]} />
        </div>
      ),
    },
  ],
}

const rating: DocEntry = {
  slug: 'rating',
  name: 'Rating',
  category: 'Datos',
  description: 'Componente de estrellas (o cualquier glifo SVG) con soporte para medios pasos, modo solo lectura y personalización total de color e ícono.',
  importLine: "import { Rating } from './lib'",
  props: [
    { name: 'value', type: 'number', default: '0', description: 'Valor actual. Con allowHalf admite decimales en pasos de 0.5.' },
    { name: 'max', type: 'number', default: '5', description: 'Número total de ítems a renderizar.' },
    { name: 'editable', type: 'boolean', default: 'false', description: 'Cuando true, los íconos son botones interactivos con hover. Cuando false, es solo lectura.' },
    { name: 'allowHalf', type: 'boolean', default: 'false', description: 'Permite seleccionar y mostrar valores en pasos de 0.5 según la mitad del ícono donde se hace clic.' },
    { name: 'size', type: 'number', default: '20', description: 'Ancho y alto de cada ícono en píxeles.' },
    { name: 'color', type: 'string', default: "'var(--primary,#C9A24B)'", description: 'Color de relleno de los íconos activos. Acepta cualquier valor CSS.' },
    { name: 'iconPath', type: 'string', description: 'Path SVG personalizado en viewBox 0 0 24 24. Por defecto usa una estrella.' },
  ],
  events: [
    { name: 'onChange', type: '(value: number) => void', description: 'Se dispara al hacer clic. El valor refleja la mitad del ícono cuando allowHalf está activo.' },
  ],
  examples: [
    {
      title: 'Solo lectura — valores fijos',
      description: 'editable=false (default). Admite valores enteros y decimales.',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Rating value={5} />
          <Rating value={4} />
          <Rating value={3.5} allowHalf />
          <Rating value={2} />
          <Rating value={0} />
        </div>
      ),
      code: `<Rating value={4} />\n<Rating value={3.5} allowHalf />`,
    },
    {
      title: 'Editable — selección entera',
      description: 'Clic en cualquier ícono establece el valor entero.',
      node: <RatingEditableDemo />,
      code: `const [val, setVal] = useState(3)\n<Rating value={val} editable onChange={setVal} />`,
    },
    {
      title: 'Editable — medios pasos (allowHalf)',
      description: 'Clic en la mitad izquierda del ícono selecciona +0.5, derecha +1.',
      node: <RatingHalfDemo />,
      code: `const [val, setVal] = useState(3.5)\n<Rating value={val} editable allowHalf onChange={setVal} />`,
    },
    {
      title: 'Ícono personalizado — corazón',
      description: 'iconPath acepta cualquier path SVG en viewBox 0 0 24 24.',
      node: <RatingHeartDemo />,
      code: `const HEART_PATH = 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0...'\n<Rating value={val} editable allowHalf iconPath={HEART_PATH} color="var(--destructive,#E5604D)" onChange={setVal} />`,
    },
    {
      title: 'Color personalizado',
      description: 'El prop color acepta cualquier valor CSS — útil para contextos semánticos.',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Rating value={4} color="var(--success,#34D17E)" />
          <Rating value={3} color="var(--destructive,#E5604D)" />
          <Rating value={5} color="#7C6FF7" />
        </div>
      ),
      code: `<Rating value={4} color="var(--success,#34D17E)" />`,
    },
    {
      title: 'Tamaños',
      description: 'El prop size controla el ancho y alto de cada ícono.',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Rating value={4} size={14} />
          <Rating value={4} size={20} />
          <Rating value={4} size={28} />
          <Rating value={4} size={36} />
        </div>
      ),
      code: `<Rating value={4} size={28} />`,
    },
    {
      title: 'max personalizado',
      description: 'Escalas de 3, 5 o 10 estrellas según el contexto.',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Rating value={2} max={3} />
          <Rating value={4} max={5} />
          <Rating value={7} max={10} />
        </div>
      ),
      code: `<Rating value={7} max={10} />`,
    },
    {
      title: 'En tarjeta de producto',
      description: 'Combina Rating de solo lectura con texto de conteo.',
      node: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Rating value={4.5} allowHalf size={16} />
          <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: '14px', color: 'var(--foreground,#F4EFE6)' }}>4.5</span>
          <span style={{ fontFamily: 'Archivo', fontSize: '13px', color: 'var(--subtle-foreground,#6B7480)' }}>(1,284 reseñas)</span>
        </div>
      ),
      code: `<Rating value={4.5} allowHalf size={16} />`,
    },
  ],
}

const entries: DocEntry[] = [
  badge,
  chip,
  tag,
  avatar,
  avatarGroup,
  statusDot,
  kbd,
  statTile,
  descriptionList,
  rating,
]
export default entries
