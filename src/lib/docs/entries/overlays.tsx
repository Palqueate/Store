import { useState } from 'react'
import type { DocEntry } from '../types'
import { Modal, Drawer, Tooltip, Popover, Menu, Btn } from '../../index'
import {
  PencilIcon, TrashIcon, ArrowDownTrayIcon, ShareIcon,
  EllipsisHorizontalIcon, FunnelIcon, InformationCircleIcon,
  CheckCircleIcon, ExclamationTriangleIcon, UserIcon, Cog6ToothIcon,
  ArrowRightOnRectangleIcon, BellIcon, PlusIcon,
} from '@heroicons/react/24/outline'

// ─── Modal demos ─────────────────────────────────────────────────────────────

function ModalBasicDemo() {
  const [o, setO] = useState(false)
  return (
    <>
      <Btn label="Abrir modal" size="sm" onClick={() => setO(true)} />
      <Modal open={o} title="Confirmar acción" onClose={() => setO(false)}
        footer={<><Btn label="Cancelar" size="sm" variant="secondary" onClick={() => setO(false)} /><Btn label="Confirmar" size="sm" onClick={() => setO(false)} /></>}>
        <p style={{ margin: 0 }}>¿Estás seguro de que querés continuar? Esta acción no se puede deshacer.</p>
      </Modal>
    </>
  )
}

function ModalNoTitleDemo() {
  const [o, setO] = useState(false)
  return (
    <>
      <Btn label="Sin título" size="sm" variant="secondary" onClick={() => setO(true)} />
      <Modal open={o} onClose={() => setO(false)}
        footer={<Btn label="Cerrar" size="sm" variant="ghost" onClick={() => setO(false)} />}>
        <p style={{ margin: 0 }}>Modal sin encabezado. Útil para confirmaciones rápidas o contenido que habla por sí solo.</p>
      </Modal>
    </>
  )
}

function ModalWideDemo() {
  const [o, setO] = useState(false)
  return (
    <>
      <Btn label="Ancho 680px" size="sm" variant="secondary" onClick={() => setO(true)} />
      <Modal open={o} title="Vista detallada" width={680} onClose={() => setO(false)}
        footer={<Btn label="Listo" size="sm" onClick={() => setO(false)} />}>
        <p style={{ margin: 0 }}>Este modal usa <code>width=&#123;680&#125;</code>. Ideal para formularios o tablas de datos que necesitan más espacio horizontal.</p>
      </Modal>
    </>
  )
}

function ModalScrollDemo() {
  const [o, setO] = useState(false)
  const items = Array.from({ length: 20 }, (_, i) => `Elemento ${i + 1}`)
  return (
    <>
      <Btn label="Contenido largo" size="sm" variant="ghost" onClick={() => setO(true)} />
      <Modal open={o} title="Lista extensa" onClose={() => setO(false)}
        footer={<Btn label="Cerrar" size="sm" variant="secondary" onClick={() => setO(false)} />}>
        <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
          {items.map(it => <li key={it} style={{ marginBottom: '6px' }}>{it}</li>)}
        </ul>
      </Modal>
    </>
  )
}

function ModalDangerDemo() {
  const [o, setO] = useState(false)
  return (
    <>
      <Btn label="Eliminar cuenta" size="sm" variant="danger" onClick={() => setO(true)} />
      <Modal open={o} title="Eliminar cuenta permanentemente" onClose={() => setO(false)}
        footer={<><Btn label="Cancelar" size="sm" variant="secondary" onClick={() => setO(false)} /><Btn label="Eliminar para siempre" size="sm" variant="danger" onClick={() => setO(false)} /></>}>
        <p style={{ margin: 0 }}>Esta operación es <strong>irreversible</strong>. Se borrarán todos tus datos, proyectos y configuraciones asociados a esta cuenta.</p>
      </Modal>
    </>
  )
}

// ─── Drawer demos ─────────────────────────────────────────────────────────────

function DrawerRightDemo() {
  const [o, setO] = useState(false)
  return (
    <>
      <Btn label="Abrir desde la derecha" size="sm" onClick={() => setO(true)} />
      <Drawer open={o} title="Detalle del ítem" side="right" onClose={() => setO(false)}
        footer={<><Btn label="Cancelar" size="sm" variant="secondary" onClick={() => setO(false)} /><Btn label="Guardar" size="sm" onClick={() => setO(false)} /></>}>
        <p style={{ margin: 0 }}>Panel lateral derecho. Ideal para vistas de detalle, edición inline y configuraciones secundarias.</p>
      </Drawer>
    </>
  )
}

function DrawerLeftDemo() {
  const [o, setO] = useState(false)
  return (
    <>
      <Btn label="Abrir desde la izquierda" size="sm" variant="secondary" onClick={() => setO(true)} />
      <Drawer open={o} title="Navegación" side="left" onClose={() => setO(false)}>
        <ul style={{ margin: 0, padding: '0 0 0 18px', lineHeight: 2 }}>
          <li>Inicio</li>
          <li>Proyectos</li>
          <li>Equipo</li>
          <li>Configuración</li>
        </ul>
      </Drawer>
    </>
  )
}

function DrawerFilterDemo() {
  const [o, setO] = useState(false)
  return (
    <>
      <Btn label="Filtros" size="sm" variant="secondary" leadingIcon={<FunnelIcon />} onClick={() => setO(true)} />
      <Drawer open={o} title="Filtrar resultados" side="right" width={320} onClose={() => setO(false)}
        footer={<><Btn label="Limpiar" size="sm" variant="ghost" onClick={() => setO(false)} /><Btn label="Aplicar filtros" size="sm" onClick={() => setO(false)} /></>}>
        <p style={{ margin: 0 }}>Drawer angosto (<code>width=&#123;320&#125;</code>) para paneles de filtros. El scroll interno se activa cuando el contenido supera el alto de la pantalla.</p>
      </Drawer>
    </>
  )
}

function DrawerNoFooterDemo() {
  const [o, setO] = useState(false)
  return (
    <>
      <Btn label="Sin footer" size="sm" variant="ghost" onClick={() => setO(true)} />
      <Drawer open={o} title="Notificaciones" side="right" onClose={() => setO(false)}>
        <p style={{ margin: '0 0 12px' }}>Drawer sin footer. El usuario cierra con Escape, haciendo clic en el overlay o con la X del encabezado.</p>
        <p style={{ margin: 0 }}>Útil para paneles de solo lectura como notificaciones, ayuda contextual o logs de actividad.</p>
      </Drawer>
    </>
  )
}

// ─── Entries ──────────────────────────────────────────────────────────────────

const modal: DocEntry = {
  slug: 'modal',
  name: 'Modal',
  category: 'Overlays',
  description: 'Diálogo centrado con backdrop de desenfoque. Cierra con Escape o clic en el overlay. Acepta título, contenido libre y un footer para acciones.',
  importLine: "import { Modal } from './lib'",
  props: [
    { name: 'open', type: 'boolean', default: 'false', description: 'Controla la visibilidad del modal.' },
    { name: 'title', type: 'string', description: 'Texto del encabezado. Si se omite, no se renderiza la barra superior.' },
    { name: 'children', type: 'ReactNode', description: 'Contenido principal del cuerpo del modal.' },
    { name: 'footer', type: 'ReactNode', description: 'Slot inferior — normalmente los botones de acción.' },
    { name: 'width', type: 'number', default: '480', description: 'Ancho máximo en píxeles.' },
  ],
  events: [
    { name: 'onClose', type: '() => void', description: 'Se dispara al presionar Escape, hacer clic en el overlay o en la X del encabezado.' },
  ],
  notes: [
    'El modal no maneja su propio estado: debés controlar `open` desde afuera con `useState`.',
    'El scroll interno se activa automáticamente cuando el contenido supera el 90% de la altura de la pantalla.',
    'Siempre usá el slot `footer` para los botones de acción en lugar de incluirlos en el `children`.',
  ],
  examples: [
    {
      title: 'Confirmación básica',
      description: 'El caso más común: título, cuerpo y dos botones en el footer.',
      node: <ModalBasicDemo />,
      code: `function ModalBasicDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Btn label="Abrir modal" size="sm" onClick={() => setOpen(true)} />
      <Modal
        open={open}
        title="Confirmar acción"
        onClose={() => setOpen(false)}
        footer={
          <>
            <Btn label="Cancelar" size="sm" variant="secondary" onClick={() => setOpen(false)} />
            <Btn label="Confirmar" size="sm" onClick={() => setOpen(false)} />
          </>
        }
      >
        <p>¿Estás seguro de que querés continuar? Esta acción no se puede deshacer.</p>
      </Modal>
    </>
  )
}`,
    },
    {
      title: 'Sin título',
      description: 'Omitir `title` suprime el encabezado. Útil para confirmaciones rápidas.',
      node: <ModalNoTitleDemo />,
      code: `<Modal open={open} onClose={close} footer={<Btn label="Cerrar" size="sm" variant="ghost" onClick={close} />}>
  <p>Modal sin encabezado.</p>
</Modal>`,
    },
    {
      title: 'Ancho personalizado',
      description: 'Usá `width` para adaptar el modal a formularios o tablas más anchas.',
      node: <ModalWideDemo />,
      code: `<Modal open={open} title="Vista detallada" width={680} onClose={close}
  footer={<Btn label="Listo" size="sm" onClick={close} />}
>
  {/* contenido wide */}
</Modal>`,
    },
    {
      title: 'Contenido con scroll',
      description: 'El cuerpo hace scroll automáticamente cuando supera el 90vh.',
      node: <ModalScrollDemo />,
    },
    {
      title: 'Acción destructiva',
      description: 'Usá `variant="danger"` en el botón confirmatorio para acciones irreversibles.',
      node: <ModalDangerDemo />,
      code: `<Modal open={open} title="Eliminar cuenta permanentemente" onClose={close}
  footer={
    <>
      <Btn label="Cancelar" size="sm" variant="secondary" onClick={close} />
      <Btn label="Eliminar para siempre" size="sm" variant="danger" onClick={close} />
    </>
  }
>
  <p>Esta operación es <strong>irreversible</strong>.</p>
</Modal>`,
    },
  ],
}

const drawer: DocEntry = {
  slug: 'drawer',
  name: 'Drawer',
  category: 'Overlays',
  description: 'Panel deslizable desde la derecha o la izquierda. Ideal para filtros, navegación, carritos de compra y vistas de detalle sin salir de la página.',
  importLine: "import { Drawer } from './lib'",
  props: [
    { name: 'open', type: 'boolean', default: 'false', description: 'Controla la visibilidad del drawer.' },
    { name: 'title', type: 'string', description: 'Texto del encabezado.' },
    { name: 'children', type: 'ReactNode', description: 'Contenido principal con scroll automático.' },
    { name: 'footer', type: 'ReactNode', description: 'Slot inferior fijo — no hace scroll junto al contenido.' },
    { name: 'side', type: "'right' | 'left'", default: "'right'", description: 'Lado desde donde aparece el panel.' },
    { name: 'width', type: 'number', default: '380', description: 'Ancho máximo en píxeles.' },
  ],
  events: [
    { name: 'onClose', type: '() => void', description: 'Se dispara al presionar Escape, hacer clic en el overlay o en la X del encabezado.' },
  ],
  notes: [
    'El footer es sticky: siempre queda visible aunque el contenido interno haga scroll.',
    'Podés omitir el `footer` si el panel es de solo lectura (el usuario cierra con Escape o la X).',
  ],
  examples: [
    {
      title: 'Detalle desde la derecha',
      description: 'Comportamiento por defecto: `side="right"` con footer de acciones.',
      node: <DrawerRightDemo />,
      code: `function DrawerDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Btn label="Abrir desde la derecha" size="sm" onClick={() => setOpen(true)} />
      <Drawer
        open={open}
        title="Detalle del ítem"
        side="right"
        onClose={() => setOpen(false)}
        footer={
          <>
            <Btn label="Cancelar" size="sm" variant="secondary" onClick={() => setOpen(false)} />
            <Btn label="Guardar" size="sm" onClick={() => setOpen(false)} />
          </>
        }
      >
        <p>Contenido del panel lateral.</p>
      </Drawer>
    </>
  )
}`,
    },
    {
      title: 'Navegación desde la izquierda',
      description: '`side="left"` para menús de navegación y sidebars.',
      node: <DrawerLeftDemo />,
      code: `<Drawer open={open} title="Navegación" side="left" onClose={close}>
  <ul>...</ul>
</Drawer>`,
    },
    {
      title: 'Panel de filtros angosto',
      description: '`width={320}` para filtros y opciones secundarias.',
      node: <DrawerFilterDemo />,
      code: `<Drawer open={open} title="Filtrar resultados" side="right" width={320} onClose={close}
  footer={
    <>
      <Btn label="Limpiar" size="sm" variant="ghost" onClick={close} />
      <Btn label="Aplicar filtros" size="sm" onClick={close} />
    </>
  }
>
  {/* controles de filtro */}
</Drawer>`,
    },
    {
      title: 'Sin footer',
      description: 'Para paneles de solo lectura como notificaciones o logs.',
      node: <DrawerNoFooterDemo />,
      code: `<Drawer open={open} title="Notificaciones" side="right" onClose={close}>
  <p>Contenido de solo lectura.</p>
</Drawer>`,
    },
  ],
}

const tooltip: DocEntry = {
  slug: 'tooltip',
  name: 'Tooltip',
  category: 'Overlays',
  description: 'Etiqueta flotante activada por hover o foco. Cuatro posiciones disponibles. Mejora la accesibilidad de íconos y controles sin texto visible.',
  importLine: "import { Tooltip } from './lib'",
  props: [
    { name: 'label', type: 'string', required: true, description: 'Texto que se muestra en el tooltip.' },
    { name: 'children', type: 'ReactNode', required: true, description: 'El elemento que activa el tooltip al recibir hover o foco.' },
    { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Posición del tooltip relativa al trigger.' },
    { name: 'arrow', type: 'boolean', default: 'false', description: 'Si es true, muestra un pico apuntando al elemento referenciado.' },
  ],
  notes: [
    'El tooltip se activa con hover y también con foco de teclado, lo que lo hace accesible por defecto.',
    'Usá tooltips para describir íconos o acciones cuyo significado no es evidente a primera vista.',
    'Evitá usar tooltips para información crítica que el usuario necesita para completar una tarea.',
  ],
  examples: [
    {
      title: 'Posición top (default)',
      node: (
        <Tooltip label="Guardar cambios">
          <Btn label="Guardar" size="sm" />
        </Tooltip>
      ),
      code: `<Tooltip label="Guardar cambios">
  <Btn label="Guardar" size="sm" />
</Tooltip>`,
    },
    {
      title: 'Posición bottom',
      node: (
        <Tooltip label="Ver más información" side="bottom">
          <Btn label="Info" size="sm" variant="secondary" leadingIcon={<InformationCircleIcon />} />
        </Tooltip>
      ),
      code: `<Tooltip label="Ver más información" side="bottom">
  <Btn label="Info" size="sm" variant="secondary" />
</Tooltip>`,
    },
    {
      title: 'Posición left',
      node: (
        <Tooltip label="Eliminar elemento" side="left">
          <Btn size="sm" variant="danger" leadingIcon={<TrashIcon />} />
        </Tooltip>
      ),
      code: `<Tooltip label="Eliminar elemento" side="left">
  <Btn size="sm" variant="danger" leadingIcon={<TrashIcon />} />
</Tooltip>`,
    },
    {
      title: 'Posición right',
      node: (
        <Tooltip label="Descargar archivo" side="right">
          <Btn size="sm" variant="secondary" leadingIcon={<ArrowDownTrayIcon />} />
        </Tooltip>
      ),
      code: `<Tooltip label="Descargar archivo" side="right">
  <Btn size="sm" variant="secondary" leadingIcon={<ArrowDownTrayIcon />} />
</Tooltip>`,
    },
    {
      title: 'Sobre texto plano',
      description: 'El tooltip envuelve cualquier nodo, no solo botones.',
      node: (
        <Tooltip label="RFC 5322 — formato estándar de email" side="top">
          <span style={{ textDecoration: 'underline dotted', cursor: 'help', color: 'var(--muted-foreground,#9AA6B2)', fontSize: '14px' }}>
            formato de email
          </span>
        </Tooltip>
      ),
      code: `<Tooltip label="RFC 5322 — formato estándar de email" side="top">
  <span style={{ textDecoration: 'underline dotted', cursor: 'help' }}>
    formato de email
  </span>
</Tooltip>`,
    },
    {
      title: 'Con pico (arrow)',
      description: '`arrow` muestra un pico apuntando al elemento. Funciona en las cuatro posiciones.',
      node: (
        <>
          <Tooltip label="Arriba" side="top" arrow><Btn label="Top" size="sm" variant="secondary" /></Tooltip>
          <Tooltip label="Abajo" side="bottom" arrow><Btn label="Bottom" size="sm" variant="secondary" /></Tooltip>
          <Tooltip label="Izquierda" side="left" arrow><Btn label="Left" size="sm" variant="secondary" /></Tooltip>
          <Tooltip label="Derecha" side="right" arrow><Btn label="Right" size="sm" variant="secondary" /></Tooltip>
        </>
      ),
      code: `<Tooltip label="Guardar" side="top" arrow>
  <Btn label="Guardar" size="sm" />
</Tooltip>`,
    },
  ],
}

const popover: DocEntry = {
  slug: 'popover',
  name: 'Popover',
  category: 'Overlays',
  description: 'Panel flotante activado por clic. A diferencia del Tooltip, acepta contenido interactivo: formularios, filtros, selectores de color, etc.',
  importLine: "import { Popover } from './lib'",
  props: [
    { name: 'trigger', type: 'ReactNode', required: true, description: 'El elemento que abre y cierra el popover al hacer clic.' },
    { name: 'children', type: 'ReactNode', description: 'Contenido del panel flotante.' },
    { name: 'align', type: "'left' | 'right'", default: "'left'", description: 'Alineación horizontal del panel respecto al trigger.' },
    { name: 'width', type: 'number', default: '260', description: 'Ancho del panel en píxeles.' },
  ],
  notes: [
    'El popover se cierra al hacer clic fuera de él (overlay invisible) o al volver a clickear el trigger.',
    'Para contenido simple de solo lectura, el Tooltip es más apropiado.',
    'Usá `align="right"` cuando el trigger esté cerca del borde derecho de la pantalla para evitar overflow.',
  ],
  examples: [
    {
      title: 'Información contextual',
      description: 'Contenido rico con texto estructurado.',
      node: (
        <Popover trigger={<Btn label="¿Qué es esto?" size="sm" variant="secondary" leadingIcon={<InformationCircleIcon />} />}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: 'var(--foreground,#F4EFE6)', fontSize: '13px' }}>Plan Pro</p>
          <p style={{ margin: 0, fontSize: '13px' }}>Incluye todas las funciones del plan Free más soporte prioritario, exportación ilimitada y acceso a la API.</p>
        </Popover>
      ),
      code: `<Popover trigger={<Btn label="¿Qué es esto?" size="sm" variant="secondary" />}>
  <p style={{ fontWeight: 700 }}>Plan Pro</p>
  <p>Incluye todas las funciones...</p>
</Popover>`,
    },
    {
      title: 'Filtro compacto',
      description: 'Formulario embebido dentro del popover.',
      node: (
        <Popover trigger={<Btn label="Filtrar" size="sm" variant="secondary" leadingIcon={<FunnelIcon />} />} width={220}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, color: 'var(--foreground,#F4EFE6)', fontSize: '13px' }}>Estado</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
            {['Activo', 'Pausado', 'Archivado'].map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--primary,#C9A24B)' }} /> {s}
              </label>
            ))}
          </div>
        </Popover>
      ),
      code: `<Popover trigger={<Btn label="Filtrar" size="sm" variant="secondary" />} width={220}>
  {/* checkboxes, radios u otros controles */}
</Popover>`,
    },
    {
      title: 'Alineación derecha',
      description: '`align="right"` ancla el panel al lado derecho del trigger.',
      node: (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Popover trigger={<Btn label="Opciones" size="sm" variant="ghost" />} align="right">
            <p style={{ margin: 0, fontSize: '13px' }}>Este panel se abre alineado a la derecha. Ideal cuando el trigger está cerca del borde derecho.</p>
          </Popover>
        </div>
      ),
      code: `<Popover trigger={<Btn label="Opciones" size="sm" />} align="right">
  {/* contenido */}
</Popover>`,
    },
    {
      title: 'Ancho personalizado con datos',
      description: 'Aumentá `width` para popovers con más contenido.',
      node: (
        <Popover trigger={<Btn label="Ver resumen" size="sm" />} width={320}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: 'var(--foreground,#F4EFE6)', fontSize: '13px' }}>Resumen del período</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ventas</span><span style={{ color: 'var(--foreground,#F4EFE6)' }}>$12.430</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Órdenes</span><span style={{ color: 'var(--foreground,#F4EFE6)' }}>84</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ticket promedio</span><span style={{ color: 'var(--foreground,#F4EFE6)' }}>$147,97</span></div>
          </div>
        </Popover>
      ),
      code: `<Popover trigger={<Btn label="Ver resumen" size="sm" />} width={320}>
  {/* tabla o estadísticas */}
</Popover>`,
    },
  ],
}

const menu: DocEntry = {
  slug: 'menu',
  name: 'Menu',
  category: 'Overlays',
  description: 'Menú desplegable de acciones. Cierra automáticamente al seleccionar un ítem o hacer clic afuera. Soporta íconos y ítems destructivos.',
  importLine: "import { Menu } from './lib'",
  props: [
    { name: 'trigger', type: 'ReactNode', required: true, description: 'El elemento que abre y cierra el menú.' },
    { name: 'items', type: 'MenuItem[]', default: '[]', description: 'Lista de ítems del menú.' },
    { name: 'align', type: "'left' | 'right'", default: "'left'", description: 'Alineación horizontal del panel respecto al trigger.' },
  ],
  notes: [
    'Cada `MenuItem` requiere `key` (único) y `label`. Los campos opcionales son `icon` (ReactNode), `danger` (boolean) y `onClick`.',
    'Los ítems con `danger: true` se muestran en rojo para indicar acciones destructivas.',
    'Siempre incluí `key` único por ítem — Menu lo usa internamente para el render.',
  ],
  examples: [
    {
      title: 'Menú básico con íconos',
      description: 'Ítems con íconos y una acción destructiva al final.',
      node: (
        <Menu
          trigger={<Btn label="Acciones" size="sm" trailingIcon={<EllipsisHorizontalIcon />} />}
          items={[
            { key: 'edit', label: 'Editar', icon: <PencilIcon style={{ width: 16 }} />, onClick: () => {} },
            { key: 'share', label: 'Compartir', icon: <ShareIcon style={{ width: 16 }} />, onClick: () => {} },
            { key: 'download', label: 'Descargar', icon: <ArrowDownTrayIcon style={{ width: 16 }} />, onClick: () => {} },
            { key: 'delete', label: 'Eliminar', icon: <TrashIcon style={{ width: 16 }} />, danger: true, onClick: () => {} },
          ]}
        />
      ),
      code: `<Menu
  trigger={<Btn label="Acciones" size="sm" />}
  items={[
    { key: 'edit',     label: 'Editar',     icon: <PencilIcon />,        onClick: () => {} },
    { key: 'share',    label: 'Compartir',  icon: <ShareIcon />,         onClick: () => {} },
    { key: 'download', label: 'Descargar',  icon: <ArrowDownTrayIcon />, onClick: () => {} },
    { key: 'delete',   label: 'Eliminar',   icon: <TrashIcon />, danger: true, onClick: () => {} },
  ]}
/>`,
    },
    {
      title: 'Menú de usuario',
      description: 'Perfil, configuración y cierre de sesión.',
      node: (
        <Menu
          trigger={<Btn label="Mi cuenta" size="sm" variant="secondary" leadingIcon={<UserIcon style={{ width: 16 }} />} />}
          items={[
            { key: 'profile', label: 'Ver perfil', icon: <UserIcon style={{ width: 16 }} />, onClick: () => {} },
            { key: 'settings', label: 'Configuración', icon: <Cog6ToothIcon style={{ width: 16 }} />, onClick: () => {} },
            { key: 'notifs', label: 'Notificaciones', icon: <BellIcon style={{ width: 16 }} />, onClick: () => {} },
            { key: 'logout', label: 'Cerrar sesión', icon: <ArrowRightOnRectangleIcon style={{ width: 16 }} />, danger: true, onClick: () => {} },
          ]}
        />
      ),
      code: `<Menu
  trigger={<Btn label="Mi cuenta" size="sm" variant="secondary" />}
  items={[
    { key: 'profile',  label: 'Ver perfil',     icon: <UserIcon /> },
    { key: 'settings', label: 'Configuración',  icon: <Cog6ToothIcon /> },
    { key: 'notifs',   label: 'Notificaciones', icon: <BellIcon /> },
    { key: 'logout',   label: 'Cerrar sesión',  icon: <ArrowRightOnRectangleIcon />, danger: true },
  ]}
/>`,
    },
    {
      title: 'Alineación derecha',
      description: 'Usá `align="right"` cuando el trigger esté en el extremo derecho del layout.',
      node: (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Menu
            trigger={<Btn size="sm" variant="ghost" leadingIcon={<EllipsisHorizontalIcon />} />}
            align="right"
            items={[
              { key: 'new', label: 'Nueva tarea', icon: <PlusIcon style={{ width: 16 }} />, onClick: () => {} },
              { key: 'archive', label: 'Archivar todo', icon: <CheckCircleIcon style={{ width: 16 }} />, onClick: () => {} },
              { key: 'wipe', label: 'Borrar todo', icon: <TrashIcon style={{ width: 16 }} />, danger: true, onClick: () => {} },
            ]}
          />
        </div>
      ),
      code: `<Menu
  trigger={<Btn size="sm" variant="ghost" leadingIcon={<EllipsisHorizontalIcon />} />}
  align="right"
  items={[...]}
/>`,
    },
    {
      title: 'Sin íconos',
      description: 'Los íconos son opcionales — el menú se adapta al contenido.',
      node: (
        <Menu
          trigger={<Btn label="Ordenar por" size="sm" variant="secondary" />}
          items={[
            { key: 'name', label: 'Nombre (A → Z)', onClick: () => {} },
            { key: 'date', label: 'Fecha de creación', onClick: () => {} },
            { key: 'modified', label: 'Última modificación', onClick: () => {} },
            { key: 'size', label: 'Tamaño', onClick: () => {} },
          ]}
        />
      ),
      code: `<Menu
  trigger={<Btn label="Ordenar por" size="sm" variant="secondary" />}
  items={[
    { key: 'name',     label: 'Nombre (A → Z)' },
    { key: 'date',     label: 'Fecha de creación' },
    { key: 'modified', label: 'Última modificación' },
    { key: 'size',     label: 'Tamaño' },
  ]}
/>`,
    },
    {
      title: 'Ítem danger resaltado',
      description: 'Solo el ítem con `danger: true` cambia de color; el resto permanece normal.',
      node: (
        <Menu
          trigger={<Btn label="Proyecto" size="sm" variant="ghost" />}
          items={[
            { key: 'rename', label: 'Renombrar', icon: <PencilIcon style={{ width: 16 }} />, onClick: () => {} },
            { key: 'duplicate', label: 'Duplicar', icon: <PlusIcon style={{ width: 16 }} />, onClick: () => {} },
            { key: 'warn', label: 'Reportar problema', icon: <ExclamationTriangleIcon style={{ width: 16 }} />, onClick: () => {} },
            { key: 'del', label: 'Eliminar proyecto', icon: <TrashIcon style={{ width: 16 }} />, danger: true, onClick: () => {} },
          ]}
        />
      ),
      code: `{ key: 'del', label: 'Eliminar proyecto', icon: <TrashIcon />, danger: true, onClick: handleDelete }`,
    },
  ],
}

const entries: DocEntry[] = [modal, drawer, tooltip, popover, menu]
export default entries
