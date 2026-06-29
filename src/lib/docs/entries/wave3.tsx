import { useState } from 'react'
import type { DocEntry } from '../types'
import Calendar from '../../Calendar'
import DatePicker from '../../DatePicker'
import DateRange from '../../DateRange'
import type { DateRangeValue } from '../../DateRange'

// ── seed date ─────────────────────────────────────────────────────────────────

const SEED = new Date(2026, 5, 15) // 15 jun 2026

// ── Calendar demos ────────────────────────────────────────────────────────────

function CalendarBasicDemo() {
  const [v, setV] = useState<Date | null>(new Date(2026, 5, 15))
  return (
    <div style={{ width: '280px' }}>
      <Calendar value={v} onChange={setV} />
      {v ? <div style={{ marginTop: '10px', fontFamily: "'Space Mono'", fontSize: '10px', color: 'var(--subtle-foreground,#6B7480)' }}>
        Seleccionado: {v.getDate()}/{v.getMonth() + 1}/{v.getFullYear()}
      </div> : null}
    </div>
  )
}

function CalendarNoValueDemo() {
  const [v, setV] = useState<Date | null>(null)
  return (
    <div style={{ width: '280px' }}>
      <Calendar value={v} onChange={setV} />
    </div>
  )
}

function CalendarMinMaxDemo() {
  const [v, setV] = useState<Date | null>(new Date(2026, 5, 15))
  return (
    <div style={{ width: '280px' }}>
      <Calendar
        value={v}
        onChange={setV}
        min={new Date(2026, 5, 10)}
        max={new Date(2026, 5, 25)}
      />
    </div>
  )
}

function CalendarNavigateDemo() {
  const [v, setV] = useState<Date | null>(new Date(2026, 0, 1))
  return (
    <div style={{ width: '280px' }}>
      <Calendar value={v} onChange={setV} />
    </div>
  )
}

// ── DatePicker demos ──────────────────────────────────────────────────────────

function DatePickerBasicDemo() {
  const [v, setV] = useState<Date | null>(new Date(2026, 5, 15))
  return <DatePicker label="Fecha del evento" value={v} onChange={setV} />
}

function DatePickerPlaceholderDemo() {
  const [v, setV] = useState<Date | null>(null)
  return <DatePicker label="Fecha de nacimiento" value={v} onChange={setV} placeholder="Elegí una fecha" />
}

function DatePickerNoLabelDemo() {
  const [v, setV] = useState<Date | null>(null)
  return <DatePicker value={v} onChange={setV} />
}

function DatePickerMinMaxDemo() {
  const [v, setV] = useState<Date | null>(null)
  return (
    <DatePicker
      label="Solo días hábiles de junio"
      value={v}
      onChange={setV}
      min={new Date(2026, 5, 1)}
      max={new Date(2026, 5, 30)}
    />
  )
}

function DatePickerDisabledDemo() {
  return (
    <DatePicker
      label="Fecha (deshabilitado)"
      value={new Date(2026, 5, 15)}
      onChange={() => {}}
      disabled
    />
  )
}

// ── DateRange demos ───────────────────────────────────────────────────────────

function DateRangeBasicDemo() {
  const [v, setV] = useState<DateRangeValue>({ start: new Date(2026, 5, 10), end: new Date(2026, 5, 20) })
  return <DateRange label="Período del viaje" value={v} onChange={setV} />
}

function DateRangeEmptyDemo() {
  const [v, setV] = useState<DateRangeValue>({ start: null, end: null })
  return <DateRange label="Rango de fechas" value={v} onChange={setV} />
}

function DateRangeOnlyStartDemo() {
  const [v, setV] = useState<DateRangeValue>({ start: new Date(2026, 5, 15), end: null })
  return <DateRange label="Inicio seleccionado" value={v} onChange={setV} />
}

function DateRangeMinMaxDemo() {
  const [v, setV] = useState<DateRangeValue>({ start: null, end: null })
  return (
    <DateRange
      label="Reserva (solo junio 2026)"
      value={v}
      onChange={setV}
      min={new Date(2026, 5, 1)}
      max={new Date(2026, 5, 30)}
    />
  )
}

function DateRangeDisabledDemo() {
  return (
    <DateRange
      label="Período (deshabilitado)"
      value={{ start: new Date(2026, 5, 1), end: new Date(2026, 5, 15) }}
      onChange={() => {}}
      disabled
    />
  )
}

// ── entries ────────────────────────────────────────────────────────────────────

const calendarEntry: DocEntry = {
  slug: 'calendar',
  name: 'Calendar',
  category: 'Inputs',
  description: 'Grilla mensual interactiva para seleccionar una fecha. Encabezado con navegación prev/next, fila de días de semana (semana empieza el lunes) y celdas de días con días adyacentes atenuados, marcador de hoy y día seleccionado en brand.',
  importLine: "import Calendar from './lib/Calendar'",
  props: [
    { name: 'value', type: 'Date | null', description: 'Fecha seleccionada actualmente. Si es null no hay selección.' },
    { name: 'onChange', type: '(d: Date) => void', required: true, description: 'Se llama al hacer clic en un día habilitado.' },
    { name: 'min', type: 'Date', description: 'Fecha mínima seleccionable (inclusive). Días previos quedan deshabilitados.' },
    { name: 'max', type: 'Date', description: 'Fecha máxima seleccionable (inclusive). Días posteriores quedan deshabilitados.' },
  ],
  events: [
    { name: 'onChange', type: '(d: Date) => void', required: true, description: 'Dispara la Date completa del día clickeado.' },
  ],
  notes: [
    'La semana empieza el lunes (Lu Ma Mi Ju Vi Sá Do) siguiendo la convención latinoamericana.',
    'Los días del mes anterior/siguiente se muestran atenuados pero permiten hacer clic para navegar.',
    'El día de hoy recibe un borde sutil en --primary aunque no esté seleccionado.',
    'No depende de ninguna librería externa de fechas — puro Date math de JS.',
    'Pensado para ser embebido dentro de popovers o modals; ancho 100% del contenedor.',
  ],
  examples: [
    {
      title: 'Selección básica',
      description: 'Grilla con una fecha preseleccionada. El label inferior muestra la fecha elegida.',
      node: <CalendarBasicDemo />,
      code: `const [v, setV] = useState<Date | null>(new Date(2026, 5, 15))
<Calendar value={v} onChange={setV} />`,
    },
    {
      title: 'Sin valor inicial',
      description: 'Sin fecha preseleccionada, solo el marcador de hoy.',
      node: <CalendarNoValueDemo />,
      code: `<Calendar value={null} onChange={setV} />`,
    },
    {
      title: 'Con min y max',
      description: 'Días fuera del rango 10–25 jun quedan deshabilitados.',
      node: <CalendarMinMaxDemo />,
      code: `<Calendar
  value={v}
  onChange={setV}
  min={new Date(2026, 5, 10)}
  max={new Date(2026, 5, 25)}
/>`,
    },
    {
      title: 'Enero 2026',
      description: 'Navegación libre de meses.',
      node: <CalendarNavigateDemo />,
      code: `<Calendar value={new Date(2026, 0, 1)} onChange={setV} />`,
    },
  ],
}

const datePickerEntry: DocEntry = {
  slug: 'date-picker',
  name: 'DatePicker',
  category: 'Inputs',
  description: 'Trigger estilo Field (ícono de calendario + fecha formateada o placeholder) que abre un popover con Calendar. Al elegir un día el popover se cierra y el valor se actualiza. Soporta label, placeholder, min/max y estado deshabilitado.',
  importLine: "import DatePicker from './lib/DatePicker'",
  props: [
    { name: 'value', type: 'Date | null', description: 'Fecha actualmente seleccionada.' },
    { name: 'onChange', type: '(d: Date) => void', required: true, description: 'Se llama cuando el usuario elige un día en el calendario.' },
    { name: 'label', type: 'string', description: 'Etiqueta en Space Mono pequeña sobre el trigger.' },
    { name: 'placeholder', type: 'string', default: "'Seleccionar fecha'", description: 'Texto mostrado cuando no hay valor.' },
    { name: 'min', type: 'Date', description: 'Fecha mínima seleccionable.' },
    { name: 'max', type: 'Date', description: 'Fecha máxima seleccionable.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el trigger e impide abrir el popover.' },
  ],
  events: [
    { name: 'onChange', type: '(d: Date) => void', required: true, description: 'Fecha elegida. El popover ya está cerrado cuando se llama.' },
  ],
  notes: [
    'El formato de la fecha en el trigger es dd/mm/yyyy.',
    'El popover se cierra al hacer clic fuera (backdrop invisible a z-index 800).',
    'El borde del trigger se ilumina con --primary mientras el popover está abierto.',
    'Internamente reutiliza el componente Calendar — cualquier cambio en Calendar se refleja acá.',
  ],
  examples: [
    {
      title: 'Básico con label',
      description: 'Fecha preseleccionada, se puede cambiar.',
      node: <DatePickerBasicDemo />,
      code: `const [v, setV] = useState<Date | null>(new Date(2026, 5, 15))
<DatePicker label="Fecha del evento" value={v} onChange={setV} />`,
    },
    {
      title: 'Sin valor inicial',
      description: 'Muestra el placeholder hasta que el usuario elija.',
      node: <DatePickerPlaceholderDemo />,
      code: `<DatePicker label="Fecha de nacimiento" value={null} onChange={setV} placeholder="Elegí una fecha" />`,
    },
    {
      title: 'Sin label',
      description: 'Solo el trigger, sin etiqueta superior.',
      node: <DatePickerNoLabelDemo />,
      code: `<DatePicker value={v} onChange={setV} />`,
    },
    {
      title: 'Con min y max',
      description: 'Solo se pueden elegir días de junio 2026.',
      node: <DatePickerMinMaxDemo />,
      code: `<DatePicker
  label="Solo días de junio"
  value={v}
  onChange={setV}
  min={new Date(2026, 5, 1)}
  max={new Date(2026, 5, 30)}
/>`,
    },
    {
      title: 'Deshabilitado',
      description: 'El trigger no es clickeable.',
      node: <DatePickerDisabledDemo />,
      code: `<DatePicker label="Fecha" value={new Date(2026, 5, 15)} onChange={() => {}} disabled />`,
    },
  ],
}

const dateRangeEntry: DocEntry = {
  slug: 'date-range',
  name: 'DateRange',
  category: 'Inputs',
  description: 'Selector de rango de fechas. Trigger Field-style que muestra "dd/mm/yyyy → dd/mm/yyyy". El popover contiene una grilla mensual: primer clic = inicio, segundo clic = fin (se intercambian si fin < inicio). Los días dentro del rango se resaltan con un tono suave de brand.',
  importLine: "import DateRange from './lib/DateRange'",
  props: [
    { name: 'value', type: '{ start: Date | null; end: Date | null }', description: 'Rango actualmente seleccionado.' },
    { name: 'onChange', type: '(r: { start: Date | null; end: Date | null }) => void', required: true, description: 'Se llama al completar el rango (segundo clic) o al limpiarlo.' },
    { name: 'label', type: 'string', description: 'Etiqueta en Space Mono sobre el trigger.' },
    { name: 'min', type: 'Date', description: 'Fecha mínima seleccionable.' },
    { name: 'max', type: 'Date', description: 'Fecha máxima seleccionable.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el selector.' },
  ],
  events: [
    { name: 'onChange', type: '(r: { start: Date | null; end: Date | null }) => void', required: true, description: 'Rango actualizado. Puede tener solo start (selección parcial) o ambos.' },
  ],
  notes: [
    'Primer clic en la grilla fija el start y activa el modo "elegir fin".',
    'Al mover el mouse sobre los días con start fijado se previsualiza el rango (sin confirmar).',
    'Si el segundo clic cae antes del start, los extremos se intercambian automáticamente.',
    'El botón "Limpiar rango" resetea ambas fechas a null.',
    'El popover cierra automáticamente cuando se completa el rango (dos clics).',
    'La semana empieza el lunes, igual que Calendar.',
  ],
  examples: [
    {
      title: 'Rango preseleccionado',
      description: 'Ambas fechas ya cargadas. El rango entre medio se muestra con tono brand.',
      node: <DateRangeBasicDemo />,
      code: `const [v, setV] = useState({ start: new Date(2026, 5, 10), end: new Date(2026, 5, 20) })
<DateRange label="Período del viaje" value={v} onChange={setV} />`,
    },
    {
      title: 'Sin valor inicial',
      description: 'Vacío — el usuario elige inicio luego fin.',
      node: <DateRangeEmptyDemo />,
      code: `<DateRange label="Rango de fechas" value={{ start: null, end: null }} onChange={setV} />`,
    },
    {
      title: 'Solo inicio seleccionado',
      description: 'Estado parcial — el trigger muestra la fecha de inicio seguida de "...".',
      node: <DateRangeOnlyStartDemo />,
      code: `<DateRange label="Inicio seleccionado" value={{ start: new Date(2026, 5, 15), end: null }} onChange={setV} />`,
    },
    {
      title: 'Con min y max',
      description: 'Solo se puede elegir dentro de junio 2026.',
      node: <DateRangeMinMaxDemo />,
      code: `<DateRange
  label="Reserva (solo junio 2026)"
  value={v}
  onChange={setV}
  min={new Date(2026, 5, 1)}
  max={new Date(2026, 5, 30)}
/>`,
    },
    {
      title: 'Deshabilitado',
      description: 'Muestra el rango pero no permite interacción.',
      node: <DateRangeDisabledDemo />,
      code: `<DateRange
  label="Período"
  value={{ start: new Date(2026, 5, 1), end: new Date(2026, 5, 15) }}
  onChange={() => {}}
  disabled
/>`,
    },
  ],
}

const entries: DocEntry[] = [calendarEntry, datePickerEntry, dateRangeEntry]
export default entries
