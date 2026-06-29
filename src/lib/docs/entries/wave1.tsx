import { useState } from 'react'
import type { DocEntry } from '../types'
import Dropdown from '../../Dropdown'
import ContextMenu from '../../ContextMenu'
import UserMenu from '../../UserMenu'
import CommandPalette from '../../CommandPalette'
import Notifications from '../../Notifications'
import Fab from '../../Fab'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  BellIcon,
  FolderIcon,
  StarIcon,
  ShareIcon,
  ClipboardIcon,
  LinkIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  HomeIcon,
  ChartBarIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'

// ─── Dropdown demos ────────────────────────────────────────────────────────────

function DropdownBasicDemo() {
  return (
    <Dropdown
      trigger={
        <button style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)', color: 'var(--foreground,#F4EFE6)', fontFamily: 'Archivo', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
          Acciones ▾
        </button>
      }
      items={[
        { key: 'edit', label: 'Editar', icon: <PencilIcon /> },
        { key: 'copy', label: 'Copiar', icon: <ClipboardIcon /> },
        { key: 'share', label: 'Compartir', icon: <ShareIcon /> },
        { key: 'sep', label: '', divider: true },
        { key: 'delete', label: 'Eliminar', icon: <TrashIcon />, danger: true },
      ]}
    />
  )
}

function DropdownAlignRightDemo() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
      <Dropdown
        align="right"
        trigger={
          <button style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)', color: 'var(--foreground,#F4EFE6)', fontFamily: 'Archivo', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            Más opciones ▾
          </button>
        }
        items={[
          { key: 'download', label: 'Descargar', icon: <ArrowDownTrayIcon /> },
          { key: 'link', label: 'Copiar enlace', icon: <LinkIcon /> },
          { key: 'sep', label: '', divider: true },
          { key: 'delete', label: 'Eliminar', icon: <TrashIcon />, danger: true },
        ]}
      />
    </div>
  )
}

function DropdownWithHeaderDemo() {
  return (
    <Dropdown
      trigger={
        <button style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)', color: 'var(--foreground,#F4EFE6)', fontFamily: 'Archivo', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
          Documento ▾
        </button>
      }
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'color-mix(in srgb, var(--primary,#C9A24B) 14%, transparent)', display: 'grid', placeItems: 'center', color: 'var(--primary,#C9A24B)', flexShrink: 0 }}>
            <span style={{ width: '16px', height: '16px', display: 'flex' }}><DocumentTextIcon /></span>
          </span>
          <div>
            <div style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>Propuesta Q3</div>
            <div style={{ fontFamily: 'Archivo', fontSize: '11px', color: 'var(--subtle-foreground,#6B7480)' }}>Editado hace 2 min</div>
          </div>
        </div>
      }
      items={[
        { key: 'edit', label: 'Editar', icon: <PencilIcon /> },
        { key: 'copy', label: 'Duplicar', icon: <ClipboardIcon /> },
        { key: 'sep', label: '', divider: true },
        { key: 'delete', label: 'Eliminar', icon: <TrashIcon />, danger: true },
      ]}
    />
  )
}

function DropdownDisabledDemo() {
  return (
    <Dropdown
      trigger={
        <button style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)', color: 'var(--foreground,#F4EFE6)', fontFamily: 'Archivo', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
          Exportar ▾
        </button>
      }
      items={[
        { key: 'pdf', label: 'Exportar PDF', icon: <DocumentTextIcon /> },
        { key: 'csv', label: 'Exportar CSV', icon: <DocumentTextIcon />, disabled: true },
        { key: 'sep', label: '', divider: true },
        { key: 'share', label: 'Compartir', icon: <ShareIcon />, disabled: true },
      ]}
    />
  )
}

// ─── ContextMenu demos ─────────────────────────────────────────────────────────

function ContextMenuBasicDemo() {
  return (
    <ContextMenu
      items={[
        { key: 'open', label: 'Abrir', icon: <FolderIcon /> },
        { key: 'rename', label: 'Renombrar', icon: <PencilIcon /> },
        { key: 'copy', label: 'Copiar enlace', icon: <LinkIcon /> },
        { key: 'sep', label: '', divider: true },
        { key: 'delete', label: 'Eliminar', icon: <TrashIcon />, danger: true },
      ]}
    >
      <div style={{ padding: '24px 32px', borderRadius: '12px', border: '1px dashed var(--border,rgba(255,255,255,.2))', background: 'var(--card,#171B22)', color: 'var(--muted-foreground,#9AA6B2)', fontFamily: 'Archivo', fontSize: '14px', textAlign: 'center', userSelect: 'none', cursor: 'context-menu' }}>
        Clic derecho aquí para abrir el menú contextual
      </div>
    </ContextMenu>
  )
}

function ContextMenuFileDemo() {
  const [lastAction, setLastAction] = useState<string | null>(null)
  const files = ['Propuesta.pdf', 'Presupuesto.xlsx', 'Diseño.fig']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {lastAction && (
        <div style={{ marginBottom: '8px', padding: '8px 12px', borderRadius: '8px', background: 'color-mix(in srgb, var(--success,#3DB97A) 12%, transparent)', color: 'var(--success,#3DB97A)', fontFamily: 'Archivo', fontSize: '13px' }}>
          Acción: {lastAction}
        </div>
      )}
      {files.map(file => (
        <ContextMenu
          key={file}
          items={[
            { key: 'open', label: 'Abrir', icon: <FolderIcon />, onClick: () => setLastAction(`Abrir "${file}"`) },
            { key: 'rename', label: 'Renombrar', icon: <PencilIcon />, onClick: () => setLastAction(`Renombrar "${file}"`) },
            { key: 'sep', label: '', divider: true },
            { key: 'delete', label: 'Eliminar', icon: <TrashIcon />, danger: true, onClick: () => setLastAction(`Eliminar "${file}"`) },
          ]}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.08))', cursor: 'context-menu', userSelect: 'none' }}>
            <span style={{ width: '18px', height: '18px', color: 'var(--subtle-foreground,#6B7480)', display: 'flex' }}><DocumentTextIcon /></span>
            <span style={{ fontFamily: 'Archivo', fontSize: '14px', color: 'var(--foreground,#F4EFE6)' }}>{file}</span>
          </div>
        </ContextMenu>
      ))}
    </div>
  )
}

// ─── UserMenu demos ────────────────────────────────────────────────────────────

function UserMenuBasicDemo() {
  return (
    <UserMenu
      name="Sofía Ramírez"
      email="sofia@palqueate.com"
      items={[
        { key: 'profile', label: 'Mi perfil', icon: <UserIcon /> },
        { key: 'settings', label: 'Configuración', icon: <Cog6ToothIcon /> },
        { key: 'sep', label: '', divider: true },
        { key: 'logout', label: 'Cerrar sesión', icon: <ArrowRightOnRectangleIcon />, danger: true },
      ]}
    />
  )
}

function UserMenuAvatarDemo() {
  return (
    <UserMenu
      name="Carlos Medina"
      email="carlos@palqueate.com"
      src="https://i.pravatar.cc/150?u=carlos"
      items={[
        { key: 'profile', label: 'Mi perfil', icon: <UserIcon /> },
        { key: 'billing', label: 'Facturación', icon: <DocumentTextIcon /> },
        { key: 'sep', label: '', divider: true },
        { key: 'logout', label: 'Cerrar sesión', icon: <ArrowRightOnRectangleIcon />, danger: true },
      ]}
    />
  )
}

function UserMenuNoEmailDemo() {
  return (
    <UserMenu
      name="Admin"
      items={[
        { key: 'settings', label: 'Configuración', icon: <Cog6ToothIcon /> },
        { key: 'logout', label: 'Cerrar sesión', icon: <ArrowRightOnRectangleIcon />, danger: true },
      ]}
    />
  )
}

// ─── CommandPalette demos ──────────────────────────────────────────────────────

const PALETTE_COMMANDS = [
  { key: 'home', label: 'Ir al inicio', icon: <HomeIcon />, group: 'Navegación', hint: '⌘H', onRun: () => {} },
  { key: 'docs', label: 'Ver documentos', icon: <DocumentTextIcon />, group: 'Navegación', onRun: () => {} },
  { key: 'reports', label: 'Ver reportes', icon: <ChartBarIcon />, group: 'Navegación', onRun: () => {} },
  { key: 'new-doc', label: 'Nuevo documento', icon: <PlusIcon />, group: 'Acciones', hint: '⌘N', onRun: () => {} },
  { key: 'upload', label: 'Subir archivo', icon: <ArrowDownTrayIcon />, group: 'Acciones', onRun: () => {} },
  { key: 'share', label: 'Compartir proyecto', icon: <ShareIcon />, group: 'Acciones', onRun: () => {} },
  { key: 'settings', label: 'Configuración', icon: <Cog6ToothIcon />, group: 'Sistema', onRun: () => {} },
  { key: 'profile', label: 'Mi perfil', icon: <UserIcon />, group: 'Sistema', onRun: () => {} },
]

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative', height: '220px', border: '1px solid var(--border,rgba(255,255,255,.1))', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button
        onClick={() => setOpen(true)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', borderRadius: '12px', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)', color: 'var(--muted-foreground,#9AA6B2)', fontFamily: 'Archivo', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
      >
        <span style={{ width: '16px', height: '16px', display: 'flex' }}><MagnifyingGlassIcon /></span>
        Buscar… <kbd style={{ fontFamily: "'Space Mono'", fontSize: '10px', background: 'var(--muted,#1F2530)', color: 'var(--subtle-foreground,#6B7480)', padding: '2px 6px', borderRadius: '5px', border: '1px solid var(--border,rgba(255,255,255,.1))' }}>⌘K</kbd>
      </button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={PALETTE_COMMANDS}
        placeholder="Buscar comandos…"
      />
    </div>
  )
}

function CommandPaletteGroupsDemo() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState<string | null>(null)
  const commands = PALETTE_COMMANDS.map(c => ({
    ...c,
    onRun: () => setLast(c.label),
  }))
  return (
    <div style={{ position: 'relative', height: '220px', border: '1px solid var(--border,rgba(255,255,255,.1))', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      {last && (
        <div style={{ padding: '6px 14px', borderRadius: '8px', background: 'color-mix(in srgb, var(--primary,#C9A24B) 12%, transparent)', color: 'var(--primary,#C9A24B)', fontFamily: 'Archivo', fontSize: '13px', fontWeight: 600 }}>
          Ejecutado: {last}
        </div>
      )}
      <button
        onClick={() => setOpen(true)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', borderRadius: '12px', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)', color: 'var(--muted-foreground,#9AA6B2)', fontFamily: 'Archivo', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
      >
        Abrir paleta (con callbacks)
      </button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={commands}
      />
    </div>
  )
}

// ─── Notifications demos ───────────────────────────────────────────────────────

const SAMPLE_NOTIFICATIONS = [
  { id: '1', title: 'Nueva reserva confirmada', desc: 'Palco Norte · Sábado 28 Jun', time: 'hace 5 min', read: false, icon: <CheckIcon /> },
  { id: '2', title: 'Pago procesado', desc: '$12.400 recibidos', time: 'hace 1 h', read: false, icon: <DocumentTextIcon /> },
  { id: '3', title: 'Evento actualizado', desc: 'Cambio de horario: 21:00 hs', time: 'ayer', read: true, icon: <BellIcon /> },
]

function NotificationsBasicDemo() {
  const [items, setItems] = useState(SAMPLE_NOTIFICATIONS)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Notifications
        items={items}
        onMarkAllRead={() => setItems(prev => prev.map(i => ({ ...i, read: true })))}
      />
      <span style={{ fontFamily: 'Archivo', fontSize: '13px', color: 'var(--subtle-foreground,#6B7480)' }}>
        {items.filter(i => !i.read).length} sin leer
      </span>
    </div>
  )
}

function NotificationsEmptyDemo() {
  return (
    <Notifications items={[]} />
  )
}

function NotificationsNoIconDemo() {
  const items = [
    { id: '1', title: 'Recordatorio de reunión', desc: 'Mañana a las 10:00 hs', time: 'ahora', read: false },
    { id: '2', title: 'Documento compartido', time: 'hace 2 h', read: true },
  ]
  return <Notifications items={items} />
}

// ─── Fab demos ─────────────────────────────────────────────────────────────────

function FabBasicDemo() {
  const [count, setCount] = useState(0)
  return (
    <div style={{ position: 'relative', height: '140px', border: '1px solid var(--border,rgba(255,255,255,.1))', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'Archivo', fontSize: '14px', color: 'var(--subtle-foreground,#6B7480)' }}>Clics: {count}</span>
      <Fab
        container
        icon={<PlusIcon />}
        position="br"
        onClick={() => setCount(c => c + 1)}
      />
    </div>
  )
}

function FabLabelDemo() {
  const [msg, setMsg] = useState<string | null>(null)
  return (
    <div style={{ position: 'relative', height: '140px', border: '1px solid var(--border,rgba(255,255,255,.1))', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {msg && <span style={{ fontFamily: 'Archivo', fontSize: '13px', color: 'var(--primary,#C9A24B)' }}>{msg}</span>}
      <Fab
        container
        icon={<PlusIcon />}
        label="Nuevo"
        position="br"
        onClick={() => setMsg('¡Creando nuevo elemento!')}
      />
    </div>
  )
}

function FabSpeedDialDemo() {
  return (
    <div style={{ position: 'relative', height: '200px', border: '1px solid var(--border,rgba(255,255,255,.1))', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
      <Fab
        container
        icon={<PlusIcon />}
        position="br"
        actions={[
          { key: 'photo', label: 'Foto', icon: <PhotoIcon />, onClick: () => {} },
          { key: 'doc', label: 'Documento', icon: <DocumentTextIcon />, onClick: () => {} },
          { key: 'folder', label: 'Carpeta', icon: <FolderIcon />, onClick: () => {} },
        ]}
      />
    </div>
  )
}

function FabPositionsDemo() {
  return (
    <div style={{ position: 'relative', height: '200px', border: '1px solid var(--border,rgba(255,255,255,.1))', borderRadius: '12px', overflow: 'hidden' }}>
      <Fab container icon={<PlusIcon />} position="br" />
      <Fab container icon={<StarIcon />} position="bl" />
      <Fab container icon={<MagnifyingGlassIcon />} position="tr" />
      <Fab container icon={<Cog6ToothIcon />} position="tl" />
    </div>
  )
}

// ─── DocEntry array ────────────────────────────────────────────────────────────

const dropdown: DocEntry = {
  slug: 'dropdown',
  name: 'Dropdown',
  category: 'Overlays',
  description: 'Menú desplegable de acciones. Soporta ítems con ícono, divisores, estados danger y disabled, un header opcional y alineación izquierda/derecha. Cierra al hacer clic fuera o al seleccionar un ítem.',
  importLine: "import Dropdown from './lib/Dropdown'",
  props: [
    { name: 'trigger', type: 'ReactNode', required: true, description: 'Nodo que activa el menú al hacer clic.' },
    { name: 'items', type: 'DropdownItem[]', default: '[]', description: 'Lista de ítems del menú. Cada ítem con key, label, icon?, danger?, disabled?, divider?, onClick?.' },
    { name: 'align', type: "'left' | 'right'", default: "'left'", description: 'Alineación del panel respecto al trigger.' },
    { name: 'header', type: 'ReactNode', description: 'Bloque opcional renderizado sobre los ítems, separado por un divisor.' },
  ],
  events: [
    { name: 'items[].onClick', type: '() => void', description: 'Se dispara al hacer clic en el ítem (solo si no está disabled).' },
  ],
  notes: [
    'Los ítems con divider: true renderizan una línea separadora y no disparan eventos.',
    'El panel abre con la animación pq-lib-tip (fade-in + translateY) definida en lib.css.',
  ],
  examples: [
    {
      title: 'Básico',
      description: 'Dropdown con ícono, divisor y acción danger.',
      node: <DropdownBasicDemo />,
      code: `<Dropdown
  trigger={<button>Acciones ▾</button>}
  items={[
    { key: 'edit', label: 'Editar', icon: <PencilIcon /> },
    { key: 'sep', label: '', divider: true },
    { key: 'delete', label: 'Eliminar', icon: <TrashIcon />, danger: true },
  ]}
/>`,
    },
    {
      title: 'Alineación derecha',
      description: 'El panel se ancla al borde derecho del trigger.',
      node: <DropdownAlignRightDemo />,
      code: `<Dropdown align="right" trigger={<button>Más opciones ▾</button>} items={[...]} />`,
    },
    {
      title: 'Con header',
      description: 'Header informativo sobre los ítems.',
      node: <DropdownWithHeaderDemo />,
      code: `<Dropdown
  header={<div>Propuesta Q3 …</div>}
  trigger={<button>Documento ▾</button>}
  items={[...]}
/>`,
    },
    {
      title: 'Ítems disabled',
      description: 'Los ítems deshabilitados no disparan onClick y muestran cursor not-allowed.',
      node: <DropdownDisabledDemo />,
      code: `{ key: 'csv', label: 'Exportar CSV', disabled: true }`,
    },
  ],
}

const contextMenu: DocEntry = {
  slug: 'context-menu',
  name: 'ContextMenu',
  category: 'Overlays',
  description: 'Envuelve cualquier hijo y abre un menú contextual al hacer clic derecho. El menú aparece en las coordenadas del cursor. Cierra con clic fuera o con Escape.',
  importLine: "import ContextMenu from './lib/ContextMenu'",
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Contenido sobre el que se activa el menú con clic derecho.' },
    { name: 'items', type: 'ContextMenuItem[]', default: '[]', description: 'Lista de ítems. Misma forma que Dropdown: key, label, icon?, danger?, disabled?, divider?, onClick?.' },
  ],
  events: [
    { name: 'items[].onClick', type: '() => void', description: 'Se dispara al seleccionar el ítem.' },
  ],
  notes: [
    'Usa display: contents en el wrapper para no interferir con el layout del hijo.',
    'El panel se posiciona fixed en las coordenadas clientX/clientY del evento contextmenu.',
    'Escape cierra el menú vía listener en window.',
  ],
  examples: [
    {
      title: 'Básico',
      description: 'Clic derecho sobre el área para ver el menú.',
      node: <ContextMenuBasicDemo />,
      code: `<ContextMenu items={[
  { key: 'open', label: 'Abrir', icon: <FolderIcon /> },
  { key: 'delete', label: 'Eliminar', danger: true, icon: <TrashIcon /> },
]}>
  <div>Clic derecho aquí</div>
</ContextMenu>`,
    },
    {
      title: 'Lista de archivos',
      description: 'Cada fila tiene su propio menú contextual independiente.',
      node: <ContextMenuFileDemo />,
      code: `{files.map(file => (
  <ContextMenu key={file} items={fileItems(file)}>
    <FileRow name={file} />
  </ContextMenu>
))}`,
    },
  ],
}

const userMenu: DocEntry = {
  slug: 'user-menu',
  name: 'UserMenu',
  category: 'Overlays',
  description: 'Trigger de avatar + nombre + chevron que abre un panel con cabecera de perfil (nombre, email, avatar) y una lista de ítems. Ideal para la esquina de navegación del usuario autenticado.',
  importLine: "import UserMenu from './lib/UserMenu'",
  props: [
    { name: 'name', type: 'string', required: true, description: 'Nombre completo del usuario. Se usa para generar las iniciales si no hay src.' },
    { name: 'email', type: 'string', description: 'Email mostrado en el header del panel.' },
    { name: 'src', type: 'string', description: 'URL de la imagen de avatar. Si se omite, se muestran las iniciales.' },
    { name: 'items', type: 'UserMenuItem[]', default: '[]', description: 'Ítems del menú: key, label, icon?, danger?, disabled?, divider?, onClick?.' },
  ],
  events: [
    { name: 'items[].onClick', type: '() => void', description: 'Se dispara al seleccionar el ítem.' },
  ],
  notes: [
    'Las iniciales se calculan con la primera letra del primer nombre y la primera del último.',
    'El panel siempre muestra el header con nombre y email incluso si items está vacío.',
  ],
  examples: [
    {
      title: 'Con iniciales',
      description: 'Sin imagen de avatar — muestra iniciales con color brand.',
      node: <UserMenuBasicDemo />,
      code: `<UserMenu
  name="Sofía Ramírez"
  email="sofia@palqueate.com"
  items={[
    { key: 'profile', label: 'Mi perfil', icon: <UserIcon /> },
    { key: 'sep', label: '', divider: true },
    { key: 'logout', label: 'Cerrar sesión', danger: true, icon: <ArrowRightOnRectangleIcon /> },
  ]}
/>`,
    },
    {
      title: 'Con imagen de avatar',
      description: 'src pasa una URL y muestra la foto en trigger y header.',
      node: <UserMenuAvatarDemo />,
      code: `<UserMenu name="Carlos Medina" email="carlos@palqueate.com" src="https://…" items={[...]} />`,
    },
    {
      title: 'Sin email',
      description: 'El header muestra solo el nombre cuando email es undefined.',
      node: <UserMenuNoEmailDemo />,
      code: `<UserMenu name="Admin" items={[...]} />`,
    },
  ],
}

const commandPalette: DocEntry = {
  slug: 'command-palette',
  name: 'CommandPalette',
  category: 'Overlays',
  description: 'Modal de búsqueda de comandos estilo ⌘K. Filtrado en tiempo real, agrupación por categoría, navegación con teclado (↑↓/Enter/Escape) y autofocus. Controlado: recibe open y onClose.',
  importLine: "import CommandPalette from './lib/CommandPalette'",
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Controla la visibilidad del modal.' },
    { name: 'onClose', type: '() => void', required: true, description: 'Callback llamado al cerrar (Escape, clic en backdrop, Enter).' },
    { name: 'commands', type: 'PaletteCommand[]', default: '[]', description: 'Lista de comandos: key, label, icon?, group?, hint?, onRun.' },
    { name: 'placeholder', type: 'string', default: "'Buscar comando…'", description: 'Placeholder del input de búsqueda.' },
  ],
  events: [
    { name: 'onClose', type: '() => void', description: 'Disparado al cerrar el modal.' },
    { name: 'commands[].onRun', type: '() => void', required: true, description: 'Ejecutado al seleccionar el comando (Enter o clic).' },
  ],
  notes: [
    'El input recibe autoFocus vía ref + useEffect cuando open cambia a true.',
    'Los grupos se renderizan en orden de inserción. El grupo vacío ("") no muestra cabecera.',
    'hint es un label corto (ej. "⌘N") que aparece alineado a la derecha del ítem.',
  ],
  examples: [
    {
      title: 'Básico',
      description: 'Clic en el botón para abrir la paleta.',
      node: <CommandPaletteDemo />,
      code: `const [open, setOpen] = useState(false)

<button onClick={() => setOpen(true)}>Buscar… ⌘K</button>
<CommandPalette
  open={open}
  onClose={() => setOpen(false)}
  commands={commands}
/>`,
    },
    {
      title: 'Con callbacks',
      description: 'Al ejecutar un comando se muestra cuál fue seleccionado.',
      node: <CommandPaletteGroupsDemo />,
      code: `const commands = items.map(c => ({ ...c, onRun: () => setLast(c.label) }))
<CommandPalette open={open} onClose={() => setOpen(false)} commands={commands} />`,
    },
  ],
}

const notifications: DocEntry = {
  slug: 'notifications',
  name: 'Notifications',
  category: 'Overlays',
  description: 'Botón campana con punto rojo de no leídas que abre un panel de notificaciones. Soporta ícono, descripción y timestamp por ítem. Los no leídos se destacan con un tinte brand.',
  importLine: "import Notifications from './lib/Notifications'",
  props: [
    { name: 'items', type: 'NotificationItem[]', default: '[]', description: 'Lista de notificaciones: id, title, desc?, time?, read?, icon?.' },
    { name: 'onMarkAllRead', type: '() => void', description: 'Si se provee, muestra el botón "Marcar leídas" en el header del panel.' },
  ],
  events: [
    { name: 'onMarkAllRead', type: '() => void', description: 'Disparado al presionar "Marcar leídas".' },
  ],
  notes: [
    'El punto rojo en el trigger se muestra cuando algún ítem tiene read !== true.',
    'Los ítems no leídos reciben un tinte brand de 6% de opacidad.',
    'Si no hay ítems se muestra el estado vacío "Sin notificaciones".',
  ],
  examples: [
    {
      title: 'Con no leídas',
      description: 'Clic en la campana. "Marcar leídas" actualiza el estado.',
      node: <NotificationsBasicDemo />,
      code: `const [items, setItems] = useState(notifications)

<Notifications
  items={items}
  onMarkAllRead={() => setItems(prev => prev.map(i => ({ ...i, read: true })))}
/>`,
    },
    {
      title: 'Sin notificaciones',
      description: 'Estado vacío cuando items es [].',
      node: <NotificationsEmptyDemo />,
      code: `<Notifications items={[]} />`,
    },
    {
      title: 'Sin ícono por ítem',
      description: 'El ícono es opcional — el layout no se rompe.',
      node: <NotificationsNoIconDemo />,
      code: `{ id: '1', title: 'Recordatorio', time: 'ahora', read: false }`,
    },
  ],
}

const fab: DocEntry = {
  slug: 'fab',
  name: 'Fab',
  category: 'Acciones',
  description: 'Botón de acción flotante (FAB). Soporta speed-dial: al pasar actions[], el clic abre una pila de mini botones con etiqueta. container=true lo posiciona en absolute para usarlo dentro de un contenedor relativo.',
  importLine: "import Fab from './lib/Fab'",
  props: [
    { name: 'icon', type: 'ReactNode', required: true, description: 'Ícono del botón principal.' },
    { name: 'label', type: 'string', description: 'Texto junto al ícono. Si se provee, el botón se extiende horizontalmente.' },
    { name: 'position', type: "'br' | 'bl' | 'tr' | 'tl'", default: "'br'", description: 'Posición en la esquina del viewport (o del contenedor si container=true).' },
    { name: 'actions', type: 'FabAction[]', description: 'Lista de acciones speed-dial: key, label, icon, onClick. Activa el modo speed-dial.' },
    { name: 'onClick', type: '() => void', description: 'Callback al hacer clic cuando no hay actions.' },
    { name: 'container', type: 'boolean', default: 'false', description: 'true → position:absolute (relativo al padre). false → position:fixed (viewport).' },
  ],
  events: [
    { name: 'onClick', type: '() => void', description: 'Clic en el botón principal cuando no hay speed-dial.' },
    { name: 'actions[].onClick', type: '() => void', description: 'Clic en una acción del speed-dial.' },
  ],
  notes: [
    'container=true es necesario para los demos en docs (el padre tiene position:relative y overflow:hidden).',
    'En speed-dial mode, el ícono principal rota 45° para indicar cierre.',
    'Las etiquetas speed-dial se posicionan a la izquierda del mini botón en FABs de lado derecho, y a la derecha en los de lado izquierdo.',
  ],
  examples: [
    {
      title: 'Básico',
      description: 'FAB simple con onClick. container=true lo ancla al demo box.',
      node: <FabBasicDemo />,
      code: `<Fab icon={<PlusIcon />} onClick={() => console.log('click')} container />`,
    },
    {
      title: 'Con label',
      description: 'El botón se extiende para mostrar texto.',
      node: <FabLabelDemo />,
      code: `<Fab icon={<PlusIcon />} label="Nuevo" onClick={handleClick} container />`,
    },
    {
      title: 'Speed-dial',
      description: 'Clic para desplegar las acciones secundarias.',
      node: <FabSpeedDialDemo />,
      code: `<Fab
  icon={<PlusIcon />}
  container
  actions={[
    { key: 'photo', label: 'Foto', icon: <PhotoIcon />, onClick: () => {} },
    { key: 'doc', label: 'Documento', icon: <DocumentTextIcon />, onClick: () => {} },
  ]}
/>`,
    },
    {
      title: 'Posiciones',
      description: 'Las cuatro esquinas disponibles dentro de un contenedor.',
      node: <FabPositionsDemo />,
      code: `<Fab container icon={<PlusIcon />} position="br" />
<Fab container icon={<StarIcon />} position="bl" />
<Fab container icon={<MagnifyingGlassIcon />} position="tr" />
<Fab container icon={<Cog6ToothIcon />} position="tl" />`,
    },
  ],
}

export const entries: DocEntry[] = [dropdown, contextMenu, userMenu, commandPalette, notifications, fab]
export default entries
