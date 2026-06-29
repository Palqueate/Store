import type { DocEntry } from '../types'
import { Stack, Divider, Card, EmptyState, Accordion, Collapsible, Table, Btn } from '../../index'
import {
  PlusIcon, TicketIcon, InboxIcon, UserGroupIcon,
} from '@heroicons/react/24/outline'

// ---------------------------------------------------------------------------
// Stack
// ---------------------------------------------------------------------------
const stack: DocEntry = {
  slug: 'stack',
  name: 'Stack',
  category: 'Layout',
  description: 'Primitiva flex de layout. Controla dirección, gap, alineación y wrap con una API mínima.',
  importLine: "import { Stack } from './lib'",
  props: [
    { name: 'direction', type: "'row' | 'col'", default: "'col'", description: "Eje principal: 'col' apila verticalmente, 'row' horizontalmente." },
    { name: 'gap', type: 'number', default: '12', description: 'Espacio entre hijos en px.' },
    { name: 'align', type: "CSSProperties['alignItems']", description: 'alignItems del flex container.' },
    { name: 'justify', type: "CSSProperties['justifyContent']", description: 'justifyContent del flex container.' },
    { name: 'wrap', type: 'boolean', default: 'false', description: 'Permite que los hijos pasen a la siguiente línea.' },
    { name: 'children', type: 'ReactNode', description: 'Contenido del stack.' },
    { name: 'style', type: 'CSSProperties', description: 'Estilos inline adicionales sobre el div wrapper.' },
  ],
  examples: [
    {
      title: 'Columna (default)',
      description: 'Apila elementos verticalmente con gap de 12 px.',
      node: (
        <Stack>
          <Card padding="12px"><span style={{ fontSize: 13, color: 'var(--foreground,#F4EFE6)' }}>Item 1</span></Card>
          <Card padding="12px"><span style={{ fontSize: 13, color: 'var(--foreground,#F4EFE6)' }}>Item 2</span></Card>
          <Card padding="12px"><span style={{ fontSize: 13, color: 'var(--foreground,#F4EFE6)' }}>Item 3</span></Card>
        </Stack>
      ),
      code: '<Stack>\n  <Card>Item 1</Card>\n  <Card>Item 2</Card>\n  <Card>Item 3</Card>\n</Stack>',
    },
    {
      title: 'Fila horizontal',
      description: "direction='row' con gap 16.",
      node: (
        <Stack direction="row" gap={16} align="center">
          <Card padding="12px"><span style={{ fontSize: 13, color: 'var(--foreground,#F4EFE6)' }}>A</span></Card>
          <Card padding="12px"><span style={{ fontSize: 13, color: 'var(--foreground,#F4EFE6)' }}>B</span></Card>
          <Card padding="12px"><span style={{ fontSize: 13, color: 'var(--foreground,#F4EFE6)' }}>C</span></Card>
        </Stack>
      ),
      code: '<Stack direction="row" gap={16} align="center">\n  <Card>A</Card>\n  <Card>B</Card>\n  <Card>C</Card>\n</Stack>',
    },
    {
      title: 'justify space-between',
      node: (
        <Stack direction="row" justify="space-between" align="center" style={{ width: '100%' }}>
          <span style={{ fontSize: 13, color: 'var(--foreground,#F4EFE6)' }}>Izquierda</span>
          <span style={{ fontSize: 13, color: 'var(--subtle-foreground,#6B7480)' }}>Derecha</span>
        </Stack>
      ),
      code: '<Stack direction="row" justify="space-between" align="center">\n  <span>Izquierda</span>\n  <span>Derecha</span>\n</Stack>',
    },
    {
      title: 'Gap grande',
      description: 'gap={32} para secciones bien separadas.',
      node: (
        <Stack gap={32}>
          <Card padding="12px"><span style={{ fontSize: 13, color: 'var(--foreground,#F4EFE6)' }}>Sección A</span></Card>
          <Card padding="12px"><span style={{ fontSize: 13, color: 'var(--foreground,#F4EFE6)' }}>Sección B</span></Card>
        </Stack>
      ),
      code: '<Stack gap={32}>\n  <Card>Sección A</Card>\n  <Card>Sección B</Card>\n</Stack>',
    },
    {
      title: 'Wrap',
      description: 'Con wrap={true} los hijos pasan a la siguiente línea al quedarse sin espacio.',
      node: (
        <Stack direction="row" wrap gap={8}>
          {['React', 'TypeScript', 'Vite', 'Tailwind', 'Heroicons', 'Vitest'].map((t) => (
            <span key={t} style={{ padding: '4px 10px', borderRadius: 99, border: '1px solid var(--border,rgba(255,255,255,.1))', fontSize: 12, color: 'var(--muted-foreground,#9AA6B2)' }}>{t}</span>
          ))}
        </Stack>
      ),
      code: '<Stack direction="row" wrap gap={8}>\n  {tags.map(t => <Tag key={t}>{t}</Tag>)}\n</Stack>',
    },
  ],
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------
const divider: DocEntry = {
  slug: 'divider',
  name: 'Divider',
  category: 'Layout',
  description: 'Línea separadora horizontal o vertical. Acepta un label centrado y modo dashed para separadores tipo ticket.',
  importLine: "import { Divider } from './lib'",
  props: [
    { name: 'vertical', type: 'boolean', default: 'false', description: 'Renderiza una línea vertical en vez de horizontal.' },
    { name: 'dashed', type: 'boolean', default: 'false', description: 'Línea punteada — útil para separadores estilo ticket/stub.' },
    { name: 'children', type: 'ReactNode', description: 'Label centrado. Solo disponible en modo horizontal.' },
  ],
  examples: [
    {
      title: 'Plain',
      description: 'Línea sólida horizontal, sin decoración.',
      node: (
        <Stack gap={12}>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Arriba</span>
          <Divider />
          <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Abajo</span>
        </Stack>
      ),
      code: '<Divider />',
    },
    {
      title: 'Dashed',
      description: 'Variante punteada para separadores tipo ticket.',
      node: (
        <Stack gap={12}>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Sección superior</span>
          <Divider dashed />
          <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Sección inferior</span>
        </Stack>
      ),
      code: '<Divider dashed />',
    },
    {
      title: 'Con label',
      description: 'Texto centrado entre dos líneas. Ideal para "o continuar con".',
      node: <Divider>o</Divider>,
      code: '<Divider>o</Divider>',
    },
    {
      title: 'Label personalizado',
      node: <Divider>esta semana</Divider>,
      code: '<Divider>esta semana</Divider>',
    },
    {
      title: 'Vertical',
      description: 'Separa elementos en un Stack row.',
      node: (
        <Stack direction="row" align="center" gap={16} style={{ height: 40 }}>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Inicio</span>
          <Divider vertical />
          <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Eventos</span>
          <Divider vertical />
          <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Mi cuenta</span>
        </Stack>
      ),
      code: '<Stack direction="row" align="center">\n  <span>Inicio</span>\n  <Divider vertical />\n  <span>Eventos</span>\n</Stack>',
    },
  ],
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
const card: DocEntry = {
  slug: 'card',
  name: 'Card',
  category: 'Layout',
  description: 'Contenedor con superficie elevada. Soporta hover-lift, borde accent, sombra raised y click handler nativo.',
  importLine: "import { Card } from './lib'",
  props: [
    { name: 'hover', type: 'boolean', default: 'false', description: 'Agrega la animación de lift al pasar el cursor. También pone cursor pointer.' },
    { name: 'accent', type: 'boolean', default: 'false', description: 'Calienta el borde con el accent de la marca (tarjeta seleccionada / destacada).' },
    { name: 'raised', type: 'boolean', default: 'false', description: 'Aplica la elevación suave del design system (box-shadow).' },
    { name: 'padding', type: 'string', default: "'20px'", description: 'Padding interno. Acepta cualquier valor CSS.' },
    { name: 'children', type: 'ReactNode', description: 'Contenido.' },
    { name: 'style', type: 'CSSProperties', description: 'Estilos inline adicionales.' },
  ],
  events: [
    { name: 'onClick', type: '() => void', description: 'Click handler — habilita cursor pointer automáticamente.' },
  ],
  examples: [
    {
      title: 'Default',
      description: 'Tarjeta base sin modificadores.',
      node: (
        <Card>
          <Stack gap={4}>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--foreground,#F4EFE6)' }}>Título de tarjeta</span>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Descripción breve del contenido.</span>
          </Stack>
        </Card>
      ),
      code: '<Card>\n  <h3>Título</h3>\n  <p>Descripción</p>\n</Card>',
    },
    {
      title: 'Hover',
      description: 'hover={true} agrega la animación de lift al hacer mouse-over.',
      node: (
        <Card hover>
          <Stack gap={4}>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--foreground,#F4EFE6)' }}>Pasá el cursor</span>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Interactiva pero sin onClick explícito.</span>
          </Stack>
        </Card>
      ),
      code: '<Card hover>\n  <p>Pasá el cursor</p>\n</Card>',
    },
    {
      title: 'Accent',
      description: 'Borde brand para tarjeta seleccionada o destacada.',
      node: (
        <Card accent>
          <Stack gap={4}>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--foreground,#F4EFE6)' }}>Destacada</span>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Borde con el accent de la marca.</span>
          </Stack>
        </Card>
      ),
      code: '<Card accent>\n  <p>Destacada</p>\n</Card>',
    },
    {
      title: 'Raised',
      description: 'Elevación suave — ideal para modales o paneles flotantes.',
      node: (
        <Card raised padding="24px">
          <Stack gap={4}>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--foreground,#F4EFE6)' }}>Panel flotante</span>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Con sombra de elevación.</span>
          </Stack>
        </Card>
      ),
      code: '<Card raised padding="24px">\n  <p>Panel flotante</p>\n</Card>',
    },
    {
      title: 'Clickable',
      description: 'onClick + hover para tarjetas que navegan o disparan acciones.',
      node: (
        <Card hover onClick={() => alert('click!')}>
          <Stack direction="row" align="center" justify="space-between">
            <Stack gap={2}>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--foreground,#F4EFE6)' }}>Ver evento</span>
              <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Hacé clic en la tarjeta</span>
            </Stack>
            <TicketIcon style={{ width: 22, height: 22, color: 'var(--subtle-foreground,#6B7480)' }} />
          </Stack>
        </Card>
      ),
      code: '<Card hover onClick={() => navigate("/evento/1")}>\n  <p>Ver evento</p>\n</Card>',
    },
    {
      title: 'Padding personalizado',
      node: (
        <Card padding="8px 16px">
          <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>padding="8px 16px"</span>
        </Card>
      ),
      code: '<Card padding="8px 16px">...</Card>',
    },
    {
      title: 'Accent + Raised',
      description: 'Combinación para tarjetas seleccionadas con elevación.',
      node: (
        <Card accent raised>
          <Stack gap={4}>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--foreground,#F4EFE6)' }}>Seleccionada y elevada</span>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>accent + raised combinados.</span>
          </Stack>
        </Card>
      ),
      code: '<Card accent raised>...</Card>',
    },
  ],
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------
const emptyState: DocEntry = {
  slug: 'empty-state',
  name: 'EmptyState',
  category: 'Layout',
  description: 'Pantalla vacía con ícono, título, descripción y slot de acción. Centra el contenido y usa un fallback de íconos integrado.',
  importLine: "import { EmptyState } from './lib'",
  props: [
    { name: 'title', type: 'string', default: "'Nada por aquí'", description: 'Título principal.' },
    { name: 'description', type: 'string', description: 'Texto de apoyo bajo el título.' },
    { name: 'icon', type: 'ReactNode', description: 'Path(s) SVG dibujados con stroke currentColor. Si se omite, usa el ícono de caja por defecto.' },
    { name: 'action', type: 'ReactNode', description: 'Slot de acción (ej: un Btn). Renderizado con marginTop 12px.' },
  ],
  examples: [
    {
      title: 'Default',
      description: 'Sin props — usa el fallback de título e ícono integrado.',
      node: <EmptyState />,
      code: '<EmptyState />',
    },
    {
      title: 'Con título y descripción',
      node: (
        <EmptyState
          title="Sin entradas"
          description="Todavía no compraste ninguna entrada. Explorá los eventos disponibles."
        />
      ),
      code: '<EmptyState\n  title="Sin entradas"\n  description="Todavía no compraste ninguna entrada."\n/>',
    },
    {
      title: 'Con ícono personalizado',
      description: 'Pasá path(s) SVG al prop icon.',
      node: (
        <EmptyState
          title="Bandeja vacía"
          description="No tenés notificaciones pendientes."
          icon={<path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />}
        />
      ),
      code: '<EmptyState\n  title="Bandeja vacía"\n  icon={<path d="..." />}\n/>',
    },
    {
      title: 'Con acción',
      node: (
        <EmptyState
          title="Sin eventos"
          description="Creá tu primer evento para comenzar a vender entradas."
          icon={<><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>}
          action={<Btn label="Crear evento" leadingIcon={<PlusIcon />} variant="primary" />}
        />
      ),
      code: '<EmptyState\n  title="Sin eventos"\n  description="Creá tu primer evento."\n  action={<Btn label="Crear evento" leadingIcon={<PlusIcon />} />}\n/>',
    },
    {
      title: 'Con Heroicon como ícono',
      description: 'Pasá los paths SVG de un Heroicon directamente.',
      node: (
        <EmptyState
          title="Carpeta vacía"
          description="No hay archivos en esta carpeta."
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />}
        />
      ),
      code: '<EmptyState title="Carpeta vacía" icon={<path d="..." />} />',
    },
  ],
}

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------
const accordion: DocEntry = {
  slug: 'accordion',
  name: 'Accordion',
  category: 'Layout',
  description: 'Lista de paneles colapsables. Soporta modo single (un panel a la vez) y multiple. Maneja su propio estado interno.',
  importLine: "import { Accordion } from './lib'",
  props: [
    { name: 'items', type: 'AccordionItem[]', default: '[]', description: 'Array de items. Cada item tiene key, title y content.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Permite abrir múltiples paneles a la vez.' },
    { name: 'defaultOpen', type: 'string[]', default: '[]', description: 'Keys de los paneles abiertos en el primer render.' },
  ],
  notes: [
    'AccordionItem = { key: string; title: string; content: ReactNode }',
    'En modo single (default), abrir un panel cierra el anterior.',
    'defaultOpen acepta múltiples keys solo si multiple={true}.',
  ],
  examples: [
    {
      title: 'Básico',
      description: 'Tres paneles en modo single.',
      node: (
        <Accordion
          items={[
            { key: 'q1', title: '¿Cómo compro una entrada?', content: 'Seleccioná el evento, elegí la cantidad de entradas y completá el pago con tu método preferido.' },
            { key: 'q2', title: '¿Puedo transferir mi entrada?', content: 'Sí, podés transferir tu entrada desde Mi cuenta > Mis entradas antes de 24hs del evento.' },
            { key: 'q3', title: '¿Qué pasa si se cancela el evento?', content: 'El reembolso se procesa automáticamente en 3-5 días hábiles al método de pago original.' },
          ]}
        />
      ),
      code: '<Accordion\n  items={[\n    { key: "q1", title: "¿Cómo compro una entrada?", content: "..." },\n    { key: "q2", title: "¿Puedo transferir?", content: "..." },\n  ]}\n/>',
    },
    {
      title: 'Con panel abierto por defecto',
      node: (
        <Accordion
          defaultOpen={['info']}
          items={[
            { key: 'info', title: 'Información general', content: 'Este panel está abierto por defecto via defaultOpen.' },
            { key: 'docs', title: 'Documentación', content: 'Accedé a la documentación completa en la sección Docs.' },
          ]}
        />
      ),
      code: '<Accordion defaultOpen={["info"]} items={[...]} />',
    },
    {
      title: 'Multiple',
      description: 'multiple={true} permite abrir varios paneles simultáneamente.',
      node: (
        <Accordion
          multiple
          items={[
            { key: 'a', title: 'Panel A', content: 'Contenido del panel A. Podés abrir B y C al mismo tiempo.' },
            { key: 'b', title: 'Panel B', content: 'Contenido del panel B.' },
            { key: 'c', title: 'Panel C', content: 'Contenido del panel C.' },
          ]}
        />
      ),
      code: '<Accordion multiple items={[...]} />',
    },
    {
      title: 'Con contenido rico',
      description: 'content acepta cualquier ReactNode.',
      node: (
        <Accordion
          items={[
            {
              key: 'rich',
              title: 'Métodos de pago aceptados',
              content: (
                <Stack gap={6}>
                  {['Visa / Mastercard', 'Mercado Pago', 'Transferencia bancaria', 'Efectivo (Rapipago / Pago Fácil)'].map((m) => (
                    <span key={m} style={{ fontSize: 13 }}>• {m}</span>
                  ))}
                </Stack>
              ),
            },
            { key: 'plain', title: 'Otros datos', content: 'Los precios incluyen todos los cargos de servicio.' },
          ]}
        />
      ),
      code: '<Accordion\n  items={[\n    { key: "rich", title: "Métodos de pago", content: <ul>...</ul> },\n  ]}\n/>',
    },
  ],
}

// ---------------------------------------------------------------------------
// Collapsible
// ---------------------------------------------------------------------------
const collapsible: DocEntry = {
  slug: 'collapsible',
  name: 'Collapsible',
  category: 'Layout',
  description: 'Toggle show/hide para una región única. Más liviano que Accordion cuando solo necesitás un panel independiente.',
  importLine: "import { Collapsible } from './lib'",
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Título del trigger. Acepta string o cualquier ReactNode.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Estado inicial del panel.' },
    { name: 'children', type: 'ReactNode', description: 'Contenido colapsable.' },
  ],
  examples: [
    {
      title: 'Cerrado por defecto',
      node: (
        <Collapsible title="Filtros avanzados">
          <Stack gap={6}>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>• Rango de precio</span>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>• Categoría</span>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>• Ciudad</span>
          </Stack>
        </Collapsible>
      ),
      code: '<Collapsible title="Filtros avanzados">\n  <p>Contenido</p>\n</Collapsible>',
    },
    {
      title: 'Abierto por defecto',
      node: (
        <Collapsible title="Detalles del pedido" defaultOpen>
          <Stack gap={6}>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>2x Entrada general — $4.800</span>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Cargo de servicio — $480</span>
          </Stack>
        </Collapsible>
      ),
      code: '<Collapsible title="Detalles del pedido" defaultOpen>\n  ...\n</Collapsible>',
    },
    {
      title: 'Título con ícono',
      description: 'title acepta ReactNode, no solo strings.',
      node: (
        <Collapsible
          title={
            <Stack direction="row" align="center" gap={8}>
              <UserGroupIcon style={{ width: 16, height: 16, color: 'var(--muted-foreground,#9AA6B2)' }} />
              <span>Participantes</span>
            </Stack>
          }
        >
          <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Listado de personas inscriptas al evento.</span>
        </Collapsible>
      ),
      code: '<Collapsible title={<><Icon /><span>Participantes</span></>}>\n  ...\n</Collapsible>',
    },
    {
      title: 'Múltiples independientes',
      description: 'Varios Collapsibles uno debajo del otro — cada uno mantiene su propio estado.',
      node: (
        <Stack gap={4}>
          <Collapsible title="Sección 1">
            <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Contenido de la sección 1.</span>
          </Collapsible>
          <Collapsible title="Sección 2">
            <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Contenido de la sección 2.</span>
          </Collapsible>
          <Collapsible title="Sección 3">
            <span style={{ fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)' }}>Contenido de la sección 3.</span>
          </Collapsible>
        </Stack>
      ),
      code: '<Stack gap={4}>\n  <Collapsible title="Sección 1">...</Collapsible>\n  <Collapsible title="Sección 2">...</Collapsible>\n</Stack>',
    },
  ],
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------
type EventRow = { id: number; name: string; date: string; venue: string; tickets: number; status: string }

const eventRows: EventRow[] = [
  { id: 1, name: 'Lollapalooza 2025', date: '28 Mar', venue: 'Hipódromo de Palermo', tickets: 1240, status: 'Activo' },
  { id: 2, name: 'Personal Fest', date: '12 Abr', venue: 'Costanera Sur', tickets: 870, status: 'Activo' },
  { id: 3, name: 'Creamfields BA', date: '02 Nov', venue: 'Costa Salguero', tickets: 320, status: 'Borrador' },
  { id: 4, name: 'Ultra Music Fest', date: '15 Nov', venue: 'Tecnópolis', tickets: 0, status: 'Agotado' },
]

const statusColor: Record<string, string> = {
  Activo: 'var(--green,#4CAF50)',
  Borrador: 'var(--subtle-foreground,#6B7480)',
  Agotado: 'var(--red,#EF4444)',
}

const table: DocEntry = {
  slug: 'table',
  name: 'Table',
  category: 'Layout',
  description: 'Tabla de datos genérica con tipado en las columnas. Hairline rows, header Space Mono y slot de empty state.',
  importLine: "import { Table } from './lib'",
  props: [
    { name: 'columns', type: 'Column<T>[]', default: '[]', description: 'Definición de columnas. Cada columna tiene key, header, render opcional, align y width.' },
    { name: 'rows', type: 'T[]', default: '[]', description: 'Array de datos. T debe extender Record<string, any>.' },
    { name: 'empty', type: 'ReactNode', description: "Contenido mostrado cuando rows está vacío. Default: 'Sin datos'." },
  ],
  events: [
    { name: 'onRowClick', type: '(row: T) => void', description: 'Click en fila — agrega hover highlight automático.' },
  ],
  notes: [
    'Column<T> = { key: string; header: ReactNode; render?: (row: T) => ReactNode; align?: "left" | "right" | "center"; width?: string }',
    'Si render no se define, la celda muestra row[key] directamente.',
    'El scroll horizontal está contenido — funciona bien en mobile.',
  ],
  examples: [
    {
      title: 'Básica',
      description: 'Tabla con columnas simples y sin interacción.',
      node: (
        <Table<EventRow>
          columns={[
            { key: 'name', header: 'Evento' },
            { key: 'date', header: 'Fecha' },
            { key: 'venue', header: 'Venue' },
            { key: 'tickets', header: 'Entradas', align: 'right' },
          ]}
          rows={eventRows}
        />
      ),
      code: '<Table\n  columns={[\n    { key: "name", header: "Evento" },\n    { key: "date", header: "Fecha" },\n    { key: "tickets", header: "Entradas", align: "right" },\n  ]}\n  rows={rows}\n/>',
    },
    {
      title: 'Con badges en columna',
      description: 'render personalizado para mostrar el estado como badge.',
      node: (
        <Table<EventRow>
          columns={[
            { key: 'name', header: 'Evento' },
            { key: 'date', header: 'Fecha' },
            { key: 'tickets', header: 'Entradas', align: 'right' },
            {
              key: 'status',
              header: 'Estado',
              render: (row: any) => (
                <span style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 700,
                  color: statusColor[row.status] ?? 'var(--muted-foreground,#9AA6B2)',
                  border: `1px solid ${statusColor[row.status] ?? 'var(--border,rgba(255,255,255,.1))'}`,
                }}>
                  {row.status}
                </span>
              ),
            },
          ]}
          rows={eventRows}
        />
      ),
      code: '<Table\n  columns={[\n    { key: "name", header: "Evento" },\n    {\n      key: "status",\n      header: "Estado",\n      render: (row) => <Badge>{row.status}</Badge>,\n    },\n  ]}\n  rows={rows}\n/>',
    },
    {
      title: 'Con onRowClick',
      description: 'Filas interactivas con hover highlight automático.',
      node: (
        <Table<EventRow>
          columns={[
            { key: 'name', header: 'Evento' },
            { key: 'venue', header: 'Venue' },
            { key: 'date', header: 'Fecha', align: 'right' },
          ]}
          rows={eventRows}
          onRowClick={(row: any) => alert(`Clic en: ${row.name}`)}
        />
      ),
      code: '<Table\n  columns={[...]}\n  rows={rows}\n  onRowClick={(row) => navigate(`/eventos/${row.id}`)}\n/>',
    },
    {
      title: 'Empty state default',
      description: "Sin rows — muestra 'Sin datos'.",
      node: (
        <Table<EventRow>
          columns={[
            { key: 'name', header: 'Evento' },
            { key: 'date', header: 'Fecha' },
            { key: 'tickets', header: 'Entradas', align: 'right' },
          ]}
          rows={[]}
        />
      ),
      code: '<Table columns={[...]} rows={[]} />',
    },
    {
      title: 'Empty state personalizado',
      description: 'Slot empty con ReactNode propio.',
      node: (
        <Table<EventRow>
          columns={[
            { key: 'name', header: 'Evento' },
            { key: 'date', header: 'Fecha' },
          ]}
          rows={[]}
          empty={
            <Stack direction="row" align="center" justify="center" gap={8}>
              <InboxIcon style={{ width: 18, height: 18, color: 'var(--subtle-foreground,#6B7480)' }} />
              <span>No hay eventos para mostrar</span>
            </Stack>
          }
        />
      ),
      code: '<Table\n  columns={[...]}\n  rows={[]}\n  empty={<EmptyRow />}\n/>',
    },
    {
      title: 'Con width de columna',
      description: 'width fija columnas específicas.',
      node: (
        <Table<EventRow>
          columns={[
            { key: 'name', header: 'Evento', width: '45%' },
            { key: 'date', header: 'Fecha', width: '120px', align: 'center' },
            { key: 'tickets', header: 'Entradas', width: '100px', align: 'right' },
          ]}
          rows={eventRows.slice(0, 3)}
        />
      ),
      code: '<Table\n  columns={[\n    { key: "name", header: "Evento", width: "45%" },\n    { key: "date", header: "Fecha", width: "120px", align: "center" },\n  ]}\n  rows={rows}\n/>',
    },
  ],
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
const entries: DocEntry[] = [stack, divider, card, emptyState, accordion, collapsible, table]
export default entries
