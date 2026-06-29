import { useState } from 'react'
import type { DocEntry } from '../types'
import { Alert, Banner, Progress, ProgressRing, Spinner, Skeleton, useToast, Btn } from '../../index'

// ─── Toast demo components (app already wraps with ToastProvider) ────────────
function ToastDemo() {
  const { toast } = useToast()
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <Btn
        label="Info"
        variant="secondary"
        size="sm"
        onClick={() => toast({ title: 'Información', description: 'Este es un toast informativo.', tone: 'info' })}
      />
      <Btn
        label="Success"
        variant="secondary"
        size="sm"
        onClick={() => toast({ title: '¡Guardado!', description: 'Los cambios se guardaron correctamente.', tone: 'success' })}
      />
      <Btn
        label="Danger"
        variant="danger"
        size="sm"
        onClick={() => toast({ title: 'Error', description: 'No se pudo completar la operación.', tone: 'danger' })}
      />
      <Btn
        label="Warn"
        variant="secondary"
        size="sm"
        onClick={() => toast({ title: 'Atención', description: 'Esta acción no se puede deshacer.', tone: 'warn' })}
      />
    </div>
  )
}

function ToastTitleOnly() {
  const { toast } = useToast()
  return (
    <Btn
      label="Solo título"
      variant="secondary"
      size="sm"
      onClick={() => toast({ title: 'Operación completada', tone: 'success' })}
    />
  )
}

function ToastPersistent() {
  const { toast } = useToast()
  return (
    <Btn
      label="Persistente (duration: 0)"
      variant="secondary"
      size="sm"
      onClick={() => toast({ title: 'Esto no desaparece solo', description: 'Cerralo con la X.', tone: 'warn', duration: 0 })}
    />
  )
}

// ─── Alert close demo ────────────────────────────────────────────────────────
function AlertCloseDemo({ tone }: { tone: 'info' | 'success' | 'danger' | 'warn' }) {
  const [open, setOpen] = useState(true)
  if (!open) return (
    <Btn label="Reabrir" size="sm" variant="ghost" onClick={() => setOpen(true)} />
  )
  return (
    <Alert tone={tone} title="Con cierre" onClose={() => setOpen(false)}>
      Hacé clic en la X para cerrar esta alerta.
    </Alert>
  )
}

// ─── Banner close demo ───────────────────────────────────────────────────────
function BannerCloseDemo() {
  const [open, setOpen] = useState(true)
  if (!open) return <Btn label="Reabrir banner" size="sm" variant="ghost" onClick={() => setOpen(true)} />
  return (
    <Banner tone="warn" onClose={() => setOpen(false)}>
      Mantenimiento programado el domingo 29 a las 02:00 hs.
    </Banner>
  )
}

// ─── Alert entry ─────────────────────────────────────────────────────────────
const alert: DocEntry = {
  slug: 'alert',
  name: 'Alert',
  category: 'Feedback',
  description: 'Bloque de feedback inline. Cuatro tonos semánticos, título opcional, descripción y botón de cierre. Usa role="alert" para accesibilidad.',
  importLine: "import { Alert } from './lib'",
  props: [
    { name: 'tone', type: "'info' | 'success' | 'danger' | 'warn'", default: "'info'", description: 'Color semántico del alert.' },
    { name: 'title', type: 'string', description: 'Título en negrita. Opcional.' },
    { name: 'children', type: 'ReactNode', description: 'Cuerpo del mensaje. Opcional.' },
  ],
  events: [
    { name: 'onClose', type: '() => void', description: 'Si se pasa, muestra el botón ×. Al hacer clic llama esta función.' },
  ],
  examples: [
    {
      title: 'Tono info',
      node: <Alert tone="info" title="Información">Revisá tu bandeja de entrada para confirmar el correo.</Alert>,
      code: '<Alert tone="info" title="Información">Revisá tu bandeja de entrada para confirmar el correo.</Alert>',
    },
    {
      title: 'Tono success',
      node: <Alert tone="success" title="¡Listo!">Los cambios se guardaron correctamente.</Alert>,
      code: '<Alert tone="success" title="¡Listo!">Los cambios se guardaron correctamente.</Alert>',
    },
    {
      title: 'Tono danger',
      node: <Alert tone="danger" title="Error">No se pudo procesar el pago. Revisá los datos de la tarjeta.</Alert>,
      code: '<Alert tone="danger" title="Error">No se pudo procesar el pago. Revisá los datos de la tarjeta.</Alert>',
    },
    {
      title: 'Tono warn',
      node: <Alert tone="warn" title="Atención">Esta acción eliminará todos los registros. No se puede deshacer.</Alert>,
      code: '<Alert tone="warn" title="Atención">Esta acción eliminará todos los registros. No se puede deshacer.</Alert>',
    },
    {
      title: 'Solo mensaje, sin título',
      node: <Alert tone="info">Tu sesión expira en 10 minutos.</Alert>,
      code: '<Alert tone="info">Tu sesión expira en 10 minutos.</Alert>',
    },
    {
      title: 'Con botón de cierre',
      description: 'Pasá onClose para mostrar la X. Controlá la visibilidad con estado local.',
      node: <AlertCloseDemo tone="warn" />,
      code: `const [open, setOpen] = useState(true)
{open && (
  <Alert tone="warn" title="Con cierre" onClose={() => setOpen(false)}>
    Hacé clic en la X.
  </Alert>
)}`,
    },
    {
      title: 'Con acción embebida',
      description: 'Pasá un botón u otro nodo dentro de children.',
      node: (
        <Alert tone="info" title="Nueva versión disponible">
          <span>Hay una actualización lista.{' '}
            <button
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--primary,#C9A24B)', fontWeight: 700, fontSize: '13.5px', padding: 0,
              }}
            >
              Actualizar ahora
            </button>
          </span>
        </Alert>
      ),
      code: `<Alert tone="info" title="Nueva versión disponible">
  Hay una actualización lista.{' '}
  <button onClick={handleUpdate}>Actualizar ahora</button>
</Alert>`,
    },
    {
      title: 'Sin children — solo título',
      node: <Alert tone="success" title="Verificación completada" />,
      code: '<Alert tone="success" title="Verificación completada" />',
    },
  ],
}

// ─── Banner entry ─────────────────────────────────────────────────────────────
const banner: DocEntry = {
  slug: 'banner',
  name: 'Banner',
  category: 'Feedback',
  description: 'Franja de ancho completo para anuncios, promociones y avisos del sistema. Cinco tonos, slot de acción y botón de cierre opcional.',
  importLine: "import { Banner } from './lib'",
  props: [
    { name: 'tone', type: "'brand' | 'success' | 'danger' | 'warn' | 'neutral'", default: "'brand'", description: 'Color semántico del banner.' },
    { name: 'children', type: 'ReactNode', description: 'Contenido principal del banner.' },
    { name: 'action', type: 'ReactNode', description: 'Slot derecho para botón u otro nodo de acción.' },
  ],
  events: [
    { name: 'onClose', type: '() => void', description: 'Si se pasa, muestra el botón ×.' },
  ],
  examples: [
    {
      title: 'Tono brand',
      node: <Banner tone="brand">¡Palqueate Pro con 30 % de descuento por tiempo limitado!</Banner>,
      code: '<Banner tone="brand">¡Palqueate Pro con 30 % de descuento por tiempo limitado!</Banner>',
    },
    {
      title: 'Tono success',
      node: <Banner tone="success">Tu cuenta fue verificada exitosamente.</Banner>,
      code: '<Banner tone="success">Tu cuenta fue verificada exitosamente.</Banner>',
    },
    {
      title: 'Tono danger',
      node: <Banner tone="danger">Servicio degradado — algunas funciones pueden fallar.</Banner>,
      code: '<Banner tone="danger">Servicio degradado — algunas funciones pueden fallar.</Banner>',
    },
    {
      title: 'Tono warn',
      node: <Banner tone="warn">Tu plan gratuito vence en 3 días.</Banner>,
      code: '<Banner tone="warn">Tu plan gratuito vence en 3 días.</Banner>',
    },
    {
      title: 'Tono neutral',
      node: <Banner tone="neutral">Los precios mostrados no incluyen IVA.</Banner>,
      code: '<Banner tone="neutral">Los precios mostrados no incluyen IVA.</Banner>',
    },
    {
      title: 'Con acción',
      description: 'Pasá un nodo en action para el slot derecho.',
      node: (
        <Banner
          tone="brand"
          action={<Btn label="Ver oferta" size="sm" variant="primary" />}
        >
          Upgrade disponible: plan Pro con funciones avanzadas.
        </Banner>
      ),
      code: `<Banner
  tone="brand"
  action={<Btn label="Ver oferta" size="sm" variant="primary" />}
>
  Upgrade disponible: plan Pro con funciones avanzadas.
</Banner>`,
    },
    {
      title: 'Con cierre',
      node: <BannerCloseDemo />,
      code: `const [open, setOpen] = useState(true)
{open && (
  <Banner tone="warn" onClose={() => setOpen(false)}>
    Mantenimiento programado el domingo 29 a las 02:00 hs.
  </Banner>
)}`,
    },
    {
      title: 'Con acción y cierre',
      node: (
        <Banner
          tone="danger"
          action={<Btn label="Ver estado" size="sm" variant="secondary" />}
          onClose={() => {}}
        >
          Detectamos un intento de acceso no autorizado.
        </Banner>
      ),
      code: `<Banner
  tone="danger"
  action={<Btn label="Ver estado" size="sm" variant="secondary" />}
  onClose={() => dismiss()}
>
  Detectamos un intento de acceso no autorizado.
</Banner>`,
    },
  ],
}

// ─── Progress entry ───────────────────────────────────────────────────────────
const progress: DocEntry = {
  slug: 'progress',
  name: 'Progress',
  category: 'Feedback',
  description: 'Barra de progreso lineal. Value 0–100, color configurable, altura y etiqueta de porcentaje opcionales.',
  importLine: "import { Progress } from './lib'",
  props: [
    { name: 'value', type: 'number', default: '0', description: 'Porcentaje actual (0–100). Se clampea automáticamente.' },
    { name: 'color', type: 'string', default: "'var(--primary,#C9A24B)'", description: 'Color de relleno de la barra. Acepta cualquier valor CSS.' },
    { name: 'height', type: 'number', default: '8', description: 'Altura de la barra en px.' },
    { name: 'showLabel', type: 'boolean', default: 'false', description: 'Muestra el porcentaje numérico a la derecha.' },
  ],
  examples: [
    {
      title: 'Valores típicos',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <Progress value={25} />
          <Progress value={50} />
          <Progress value={75} />
          <Progress value={100} />
        </div>
      ),
      code: `<Progress value={25} />
<Progress value={50} />
<Progress value={75} />
<Progress value={100} />`,
    },
    {
      title: 'Con etiqueta de porcentaje',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <Progress value={42} showLabel />
          <Progress value={78} showLabel />
        </div>
      ),
      code: '<Progress value={42} showLabel />',
    },
    {
      title: 'Colores semánticos',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <Progress value={60} color="var(--success,#34D17E)" showLabel />
          <Progress value={40} color="var(--destructive,#E5604D)" showLabel />
          <Progress value={80} color="var(--warning,#E5A94D)" showLabel />
        </div>
      ),
      code: `<Progress value={60} color="var(--success,#34D17E)" showLabel />
<Progress value={40} color="var(--destructive,#E5604D)" showLabel />
<Progress value={80} color="var(--warning,#E5A94D)" showLabel />`,
    },
    {
      title: 'Alturas',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <Progress value={65} height={4} />
          <Progress value={65} height={8} />
          <Progress value={65} height={14} />
        </div>
      ),
      code: `<Progress value={65} height={4} />
<Progress value={65} height={8} />
<Progress value={65} height={14} />`,
    },
  ],
}

// ─── ProgressRing entry ───────────────────────────────────────────────────────
const progressRing: DocEntry = {
  slug: 'progress-ring',
  name: 'ProgressRing',
  category: 'Feedback',
  description: 'Indicador de progreso circular con label central configurable. Tamaño, grosor y color ajustables. El centro puede ser cualquier nodo.',
  importLine: "import { ProgressRing } from './lib'",
  props: [
    { name: 'value', type: 'number', default: '0', description: 'Porcentaje actual (0–100). Se clampea automáticamente.' },
    { name: 'size', type: 'number', default: '72', description: 'Diámetro del SVG en px.' },
    { name: 'thickness', type: 'number', default: '7', description: 'Grosor del arco en px.' },
    { name: 'color', type: 'string', default: "'var(--primary,#C9A24B)'", description: 'Color del arco de progreso.' },
    { name: 'children', type: 'ReactNode', description: 'Contenido central. Por defecto muestra el porcentaje.' },
  ],
  examples: [
    {
      title: 'Valores distintos',
      node: (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <ProgressRing value={25} />
          <ProgressRing value={50} />
          <ProgressRing value={75} />
          <ProgressRing value={100} />
        </div>
      ),
      code: `<ProgressRing value={25} />
<ProgressRing value={50} />
<ProgressRing value={75} />
<ProgressRing value={100} />`,
    },
    {
      title: 'Tamaños',
      node: (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <ProgressRing value={68} size={48} thickness={5} />
          <ProgressRing value={68} size={72} />
          <ProgressRing value={68} size={100} thickness={9} />
        </div>
      ),
      code: `<ProgressRing value={68} size={48} thickness={5} />
<ProgressRing value={68} size={72} />
<ProgressRing value={68} size={100} thickness={9} />`,
    },
    {
      title: 'Colores semánticos',
      node: (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <ProgressRing value={80} color="var(--success,#34D17E)" />
          <ProgressRing value={40} color="var(--destructive,#E5604D)" />
          <ProgressRing value={60} color="var(--warning,#E5A94D)" />
        </div>
      ),
      code: `<ProgressRing value={80} color="var(--success,#34D17E)" />
<ProgressRing value={40} color="var(--destructive,#E5604D)" />
<ProgressRing value={60} color="var(--warning,#E5A94D)" />`,
    },
    {
      title: 'Label personalizado (children)',
      node: (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <ProgressRing value={55} size={80}>
            <span style={{ fontSize: '11px', textAlign: 'center', color: 'var(--muted-foreground,#9AA6B2)', lineHeight: 1.2 }}>3/5<br />pasos</span>
          </ProgressRing>
          <ProgressRing value={100} color="var(--success,#34D17E)" size={80}>
            <span style={{ fontSize: '20px' }}>✓</span>
          </ProgressRing>
        </div>
      ),
      code: `<ProgressRing value={55} size={80}>
  <span>3/5<br />pasos</span>
</ProgressRing>`,
    },
    {
      title: 'Grosor variable',
      node: (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <ProgressRing value={70} thickness={3} />
          <ProgressRing value={70} thickness={7} />
          <ProgressRing value={70} thickness={14} />
        </div>
      ),
      code: `<ProgressRing value={70} thickness={3} />
<ProgressRing value={70} thickness={7} />
<ProgressRing value={70} thickness={14} />`,
    },
  ],
}

// ─── Spinner entry ────────────────────────────────────────────────────────────
const spinner: DocEntry = {
  slug: 'spinner',
  name: 'Spinner',
  category: 'Feedback',
  description: 'Indicador de carga giratorio. Tamaño, color y grosor configurables. Usa role="status" y aria-label="Cargando".',
  importLine: "import { Spinner } from './lib'",
  props: [
    { name: 'size', type: 'number', default: '22', description: 'Diámetro en px.' },
    { name: 'color', type: 'string', default: "'var(--primary,#C9A24B)'", description: 'Color del arco. Acepta cualquier valor CSS.' },
    { name: 'thickness', type: 'number', default: '2.5', description: 'Grosor del borde en px.' },
  ],
  examples: [
    {
      title: 'Tamaños',
      node: (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Spinner size={16} />
          <Spinner size={22} />
          <Spinner size={32} />
          <Spinner size={48} />
        </div>
      ),
      code: `<Spinner size={16} />
<Spinner size={22} />
<Spinner size={32} />
<Spinner size={48} />`,
    },
    {
      title: 'Colores semánticos',
      node: (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Spinner color="var(--primary,#C9A24B)" />
          <Spinner color="var(--success,#34D17E)" />
          <Spinner color="var(--destructive,#E5604D)" />
          <Spinner color="var(--warning,#E5A94D)" />
          <Spinner color="var(--muted-foreground,#9AA6B2)" />
        </div>
      ),
      code: `<Spinner color="var(--primary,#C9A24B)" />
<Spinner color="var(--success,#34D17E)" />
<Spinner color="var(--destructive,#E5604D)" />`,
    },
    {
      title: 'Grosor',
      node: (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Spinner size={32} thickness={1.5} />
          <Spinner size={32} thickness={2.5} />
          <Spinner size={32} thickness={4} />
        </div>
      ),
      code: `<Spinner size={32} thickness={1.5} />
<Spinner size={32} thickness={2.5} />
<Spinner size={32} thickness={4} />`,
    },
  ],
}

// ─── Skeleton entry ───────────────────────────────────────────────────────────
const skeleton: DocEntry = {
  slug: 'skeleton',
  name: 'Skeleton',
  category: 'Feedback',
  description: 'Placeholder animado para estados de carga. Configurable en ancho, alto, radio y modo círculo para avatares.',
  importLine: "import { Skeleton } from './lib'",
  props: [
    { name: 'width', type: 'string', default: "'100%'", description: 'Ancho del bloque. Acepta cualquier valor CSS.' },
    { name: 'height', type: 'string', default: "'14px'", description: 'Alto del bloque. Acepta cualquier valor CSS.' },
    { name: 'radius', type: 'string', default: "'8px'", description: 'Radio de borde. Ignorado si circle=true.' },
    { name: 'circle', type: 'boolean', default: 'false', description: 'Fuerza border-radius 50 % — ideal para avatares.' },
  ],
  notes: [
    'El componente usa aria-hidden="true" para que los lectores de pantalla ignoren el placeholder.',
    'Para simular una card compuesta, apilá varios Skeleton con distintos width/height.',
  ],
  examples: [
    {
      title: 'Líneas de texto',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <Skeleton height="16px" width="80%" />
          <Skeleton height="14px" width="100%" />
          <Skeleton height="14px" width="65%" />
        </div>
      ),
      code: `<Skeleton height="16px" width="80%" />
<Skeleton height="14px" width="100%" />
<Skeleton height="14px" width="65%" />`,
    },
    {
      title: 'Círculo (avatar)',
      node: (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Skeleton circle width="32px" height="32px" />
          <Skeleton circle width="48px" height="48px" />
          <Skeleton circle width="64px" height="64px" />
        </div>
      ),
      code: `<Skeleton circle width="32px" height="32px" />
<Skeleton circle width="48px" height="48px" />
<Skeleton circle width="64px" height="64px" />`,
    },
    {
      title: 'Card simulada',
      description: 'Combiná círculo + líneas para imitar una tarjeta de perfil.',
      node: (
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', width: '100%' }}>
          <Skeleton circle width="44px" height="44px" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton height="15px" width="55%" />
            <Skeleton height="13px" width="90%" />
            <Skeleton height="13px" width="70%" />
          </div>
        </div>
      ),
      code: `<div style={{ display: 'flex', gap: '14px' }}>
  <Skeleton circle width="44px" height="44px" />
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <Skeleton height="15px" width="55%" />
    <Skeleton height="13px" width="90%" />
    <Skeleton height="13px" width="70%" />
  </div>
</div>`,
    },
    {
      title: 'Bloque grande',
      description: 'Para placeholders de imágenes o cards.',
      node: <Skeleton height="120px" radius="14px" />,
      code: '<Skeleton height="120px" radius="14px" />',
    },
    {
      title: 'Radio pill (líneas)',
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <Skeleton height="12px" width="90%" radius="100px" />
          <Skeleton height="12px" width="75%" radius="100px" />
          <Skeleton height="12px" width="55%" radius="100px" />
        </div>
      ),
      code: '<Skeleton height="12px" width="90%" radius="100px" />',
    },
  ],
}

// ─── Toast entry ──────────────────────────────────────────────────────────────
const toast: DocEntry = {
  slug: 'toast',
  name: 'Toast',
  category: 'Feedback',
  description: 'Sistema de notificaciones emergentes. Montá ToastProvider una vez en la raíz y usá useToast() desde cualquier componente hijo para disparar toasts.',
  importLine: "import { ToastProvider, useToast } from './lib'",
  props: [
    { name: 'toast(options)', type: '(opts: ToastOptions) => void', description: 'Función del hook para disparar un nuevo toast.' },
    { name: 'options.title', type: 'string', required: true, description: 'Título principal del toast.' },
    { name: 'options.description', type: 'string', description: 'Texto secundario opcional.' },
    { name: 'options.tone', type: "'info' | 'success' | 'danger' | 'warn'", default: "'info'", description: 'Color semántico del indicador lateral.' },
    { name: 'options.duration', type: 'number', default: '4000', description: 'Ms hasta el auto-dismiss. Pasá 0 para que sea persistente.' },
    { name: 'dismiss(id)', type: '(id: number) => void', description: 'Cierra manualmente un toast por su id numérico.' },
  ],
  notes: [
    'ToastProvider debe montarse una sola vez en la raíz de la app. Esta docs page ya está envuelta en él.',
    'Los toasts aparecen en el corner inferior-derecho (fixed, zIndex 1100).',
    'duration: 0 mantiene el toast hasta que el usuario lo cierre con la X.',
    'useToast() lanza un Error si se llama fuera de ToastProvider.',
  ],
  examples: [
    {
      title: 'Los cuatro tonos',
      description: 'Cada botón dispara un toast con su tono correspondiente.',
      node: <ToastDemo />,
      code: `function Demo() {
  const { toast } = useToast()
  return (
    <Btn
      label="Success"
      onClick={() => toast({ title: '¡Guardado!', description: 'Cambios guardados.', tone: 'success' })}
    />
  )
}`,
    },
    {
      title: 'Solo título (sin descripción)',
      node: <ToastTitleOnly />,
      code: "toast({ title: 'Operación completada', tone: 'success' })",
    },
    {
      title: 'Persistente (duration: 0)',
      description: 'No desaparece automáticamente. El usuario debe cerrarlo con la X.',
      node: <ToastPersistent />,
      code: "toast({ title: 'Esto no desaparece solo', tone: 'warn', duration: 0 })",
    },
  ],
}

// ─── Export ───────────────────────────────────────────────────────────────────
const entries: DocEntry[] = [alert, banner, progress, progressRing, spinner, skeleton, toast]
export default entries
