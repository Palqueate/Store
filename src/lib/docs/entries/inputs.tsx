import { useState } from 'react'
import type { DocEntry } from '../types'
import {
  Field, Textarea, Select, SearchInput, Slider, Checkbox,
  RadioGroup, RadioCardGroup, Toggle, QuantityStepper, SegmentedControl, FileDropzone,
} from '../../index'
import {
  EnvelopeIcon, MagnifyingGlassIcon, UserIcon, LockClosedIcon,
  PhoneIcon, CalendarIcon, CurrencyDollarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

// ─── Stateful demo wrappers ────────────────────────────────────────────────

function FieldTextDemo() {
  const [v, setV] = useState('')
  return <Field label="Nombre" value={v} placeholder="Ej: Ana García" onInput={(e) => setV(e.target.value)} />
}

function FieldEmailDemo() {
  const [v, setV] = useState('')
  return (
    <Field label="Correo electrónico" type="email" value={v} placeholder="ana@ejemplo.com"
      leadingIcon={<EnvelopeIcon />} onInput={(e) => setV(e.target.value)} />
  )
}

function FieldPasswordDemo() {
  const [v, setV] = useState('')
  return (
    <Field label="Contraseña" type="password" value={v} placeholder="Mínimo 8 caracteres"
      leadingIcon={<LockClosedIcon />} onInput={(e) => setV(e.target.value)} />
  )
}

function FieldNumberDemo() {
  const [v, setV] = useState('')
  return (
    <Field label="Precio" type="number" value={v} placeholder="0.00"
      leadingIcon={<CurrencyDollarIcon />} hint="En pesos argentinos"
      onInput={(e) => setV(e.target.value)} />
  )
}

function FieldDateDemo() {
  const [v, setV] = useState('')
  return (
    <Field label="Fecha de nacimiento" type="date" value={v}
      leadingIcon={<CalendarIcon />} onInput={(e) => setV(e.target.value)} />
  )
}

function FieldSearchDemo() {
  const [v, setV] = useState('')
  return (
    <Field label="Buscar usuario" type="search" value={v} placeholder="Escribí para filtrar…"
      leadingIcon={<MagnifyingGlassIcon />} onInput={(e) => setV(e.target.value)} />
  )
}

function FieldIconsDemo() {
  const [v, setV] = useState('')
  return (
    <Field label="Usuario" value={v} placeholder="@handle"
      leadingIcon={<UserIcon />} trailingIcon={<ArrowRightIcon />}
      onInput={(e) => setV(e.target.value)} />
  )
}

function FieldHintDemo() {
  const [v, setV] = useState('')
  return (
    <Field label="Teléfono" type="tel" value={v} placeholder="+54 9 11 …"
      leadingIcon={<PhoneIcon />} hint="Incluí código de área sin 0"
      onInput={(e) => setV(e.target.value)} />
  )
}

function FieldErrorDemo() {
  const [v, setV] = useState('correo-invalido')
  return (
    <Field label="Correo" type="email" value={v} error="El correo no tiene un formato válido"
      leadingIcon={<EnvelopeIcon />} onInput={(e) => setV(e.target.value)} />
  )
}

function TextareaBasicDemo() {
  const [v, setV] = useState('')
  return <Textarea label="Descripción" value={v} placeholder="Escribí una descripción…" onInput={setV} />
}

function TextareaHintDemo() {
  const [v, setV] = useState('')
  return (
    <Textarea label="Bio" value={v} placeholder="Contanos sobre vos…"
      hint="Máximo 160 caracteres" rows={3} onInput={setV} />
  )
}

function TextareaRowsDemo() {
  const [v, setV] = useState('')
  return <Textarea label="Comentario largo" value={v} rows={8} onInput={setV} />
}

function SelectBasicDemo() {
  const [v, setV] = useState('')
  return (
    <Select label="País" value={v} placeholder="Seleccioná un país"
      options={[
        { label: 'Argentina', value: 'ar' },
        { label: 'México', value: 'mx' },
        { label: 'España', value: 'es' },
      ]}
      onChange={setV} />
  )
}

function SelectHintDemo() {
  const [v, setV] = useState('')
  return (
    <Select label="Moneda" value={v} placeholder="Elegí la moneda"
      hint="Afecta el precio final mostrado"
      options={[
        { label: 'ARS — Peso Argentino', value: 'ars' },
        { label: 'USD — Dólar', value: 'usd' },
        { label: 'EUR — Euro', value: 'eur' },
      ]}
      onChange={setV} />
  )
}

function SelectPreselectedDemo() {
  const [v, setV] = useState('ux')
  return (
    <Select label="Categoría" value={v}
      options={[
        { label: 'Diseño UX', value: 'ux' },
        { label: 'Desarrollo Frontend', value: 'fe' },
        { label: 'Producto', value: 'pm' },
        { label: 'Data', value: 'data' },
      ]}
      onChange={setV} />
  )
}

function SearchBasicDemo() {
  const [v, setV] = useState('')
  return <SearchInput value={v} onInput={setV} onClear={() => setV('')} />
}

function SearchCustomDemo() {
  const [v, setV] = useState('palqueate')
  return <SearchInput value={v} placeholder="Buscá eventos…" onInput={setV} onClear={() => setV('')} />
}

function SearchNoOnClearDemo() {
  const [v, setV] = useState('palqueate')
  return <SearchInput value={v} onInput={setV} />
}

function SliderBasicDemo() {
  const [v, setV] = useState(40)
  return <Slider label="Volumen" value={v} showValue onChange={setV} />
}

function SliderRangeDemo() {
  const [v, setV] = useState(2500)
  return <Slider label="Precio máximo" value={v} min={0} max={10000} step={100} showValue onChange={setV} />
}

function SliderStepsDemo() {
  const [v, setV] = useState(3)
  return <Slider label="Personas" value={v} min={1} max={10} step={1} showValue onChange={setV} />
}

function SliderNoLabelDemo() {
  const [v, setV] = useState(60)
  return <Slider value={v} onChange={setV} />
}

function CheckboxBasicDemo() {
  const [c, setC] = useState(false)
  return <Checkbox checked={c} label="Aceptar términos y condiciones" onChange={setC} />
}

function CheckboxGroupDemo() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  const [c, setC] = useState(true)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Checkbox checked={a} label="Notificaciones por email" onChange={setA} />
      <Checkbox checked={b} label="Notificaciones push" onChange={setB} />
      <Checkbox checked={c} label="Resumen semanal" onChange={setC} />
    </div>
  )
}

function CheckboxNoLabelDemo() {
  const [c, setC] = useState(true)
  return <Checkbox checked={c} onChange={setC} />
}

function RadioBasicDemo() {
  const [v, setV] = useState('standard')
  return (
    <RadioGroup value={v}
      options={[
        { label: 'Estándar — gratis', value: 'standard' },
        { label: 'Express — $500', value: 'express' },
        { label: 'Al día siguiente — $300', value: 'next_day' },
      ]}
      onChange={setV} />
  )
}

function RadioSizeDemo() {
  const [v, setV] = useState('m')
  return (
    <RadioGroup value={v}
      options={[
        { label: 'S', value: 's' },
        { label: 'M', value: 'm' },
        { label: 'L', value: 'l' },
        { label: 'XL', value: 'xl' },
      ]}
      onChange={setV} />
  )
}

function RadioCardDemo() {
  const [v, setV] = useState('event')
  return (
    <RadioCardGroup value={v}
      options={[
        { value: 'box', title: 'Palco entero', description: 'Los 14 asientos, por 1 año', price: '$U 1.620.000', priceSuffix: '/año' },
        { value: 'annual', title: 'Asiento anual', description: 'Tu butaca toda la temporada', price: '$U 118.000', priceSuffix: '/año · por asiento' },
        { value: 'event', title: 'Asiento por evento', description: 'Una butaca para un evento puntual', price: '$U 8.200', priceSuffix: '· por asiento' },
      ]}
      onChange={setV} />
  )
}

function ToggleBasicDemo() {
  const [on, setOn] = useState(false)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Toggle on={on} onToggle={() => setOn((v) => !v)} />
      <span style={{ fontFamily: 'Archivo', fontSize: '14px', color: 'var(--foreground,#F4EFE6)' }}>
        {on ? 'Activado' : 'Desactivado'}
      </span>
    </div>
  )
}

function ToggleRowsDemo() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  const [c, setC] = useState(true)

  function Row({ label, on, toggle }: { label: string; on: boolean; toggle: () => void }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border,rgba(255,255,255,.08))' }}>
        <span style={{ fontFamily: 'Archivo', fontSize: '14px', color: 'var(--foreground,#F4EFE6)' }}>{label}</span>
        <Toggle on={on} onToggle={toggle} />
      </div>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      <Row label="Modo oscuro" on={a} toggle={() => setA((v) => !v)} />
      <Row label="Recibir alertas" on={b} toggle={() => setB((v) => !v)} />
      <Row label="Mostrar precio en USD" on={c} toggle={() => setC((v) => !v)} />
    </div>
  )
}

function QuantityBasicDemo() {
  const [v, setV] = useState(1)
  return <QuantityStepper value={v} min={1} max={10} onChange={setV} />
}

function QuantityStepDemo() {
  const [v, setV] = useState(0)
  return <QuantityStepper value={v} min={0} max={100} step={5} onChange={setV} />
}

function QuantityZeroDemo() {
  const [v, setV] = useState(0)
  return <QuantityStepper value={v} min={0} max={99} onChange={setV} />
}

function SegmentedBasicDemo() {
  const [v, setV] = useState('list')
  return (
    <SegmentedControl value={v}
      segments={[
        { label: 'Lista', value: 'list' },
        { label: 'Cuadrícula', value: 'grid' },
        { label: 'Mapa', value: 'map' },
      ]}
      onChange={setV} />
  )
}

function SegmentedTwoDemo() {
  const [v, setV] = useState('month')
  return (
    <SegmentedControl value={v}
      segments={[{ label: 'Mes', value: 'month' }, { label: 'Semana', value: 'week' }]}
      onChange={setV} />
  )
}

function SegmentedBlockDemo() {
  const [v, setV] = useState('tickets')
  return (
    <SegmentedControl value={v} block
      segments={[
        { label: 'Entradas', value: 'tickets' },
        { label: 'Artistas', value: 'artists' },
        { label: 'Venue', value: 'venue' },
      ]}
      onChange={setV} />
  )
}

function SegmentedStatusDemo() {
  const [v, setV] = useState('on')
  return (
    <SegmentedControl value={v}
      segments={[{ label: 'Activo', value: 'on' }, { label: 'Pausado', value: 'off' }]}
      onChange={setV} />
  )
}

function FileDropzoneBasicDemo() {
  const [files, setFiles] = useState<File[]>([])
  return (
    <div>
      <FileDropzone onFiles={setFiles} />
      {files.length > 0 && (
        <div style={{ marginTop: '10px', fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
          {files.map((f) => f.name).join(', ')}
        </div>
      )}
    </div>
  )
}

function FileDropzoneMultipleDemo() {
  const [files, setFiles] = useState<File[]>([])
  return (
    <div>
      <FileDropzone multiple hint="Arrastrá o seleccioná imágenes (PNG, JPG)" accept="image/*" onFiles={setFiles} />
      {files.length > 0 && (
        <div style={{ marginTop: '10px', fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
          {files.length} {files.length === 1 ? 'archivo' : 'archivos'} seleccionado{files.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

// ─── DocEntry definitions ──────────────────────────────────────────────────

const field: DocEntry = {
  slug: 'field',
  name: 'Field',
  category: 'Inputs',
  description: 'Input de texto unificado. Soporta todos los tipos nativos HTML, íconos leading/trailing, toggle de contraseña integrado, hint y estado de error.',
  importLine: "import { Field } from './lib'",
  props: [
    { name: 'label', type: 'string', default: "''", description: 'Etiqueta visible sobre el campo.' },
    { name: 'value', type: 'string', default: "''", description: 'Valor controlado del input.' },
    { name: 'placeholder', type: 'string', default: "''", description: 'Texto de placeholder.' },
    {
      name: 'type',
      type: "'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week'",
      default: "'text'",
      description: 'Tipo nativo del input.',
    },
    { name: 'hint', type: 'string', default: "''", description: 'Texto de ayuda bajo el campo. Se oculta si hay error.' },
    { name: 'error', type: 'string', default: "''", description: 'Mensaje de error. Pone el borde rojo y reemplaza el hint.' },
    { name: 'leadingIcon', type: 'ReactNode', description: 'Ícono renderizado dentro del campo, antes del texto.' },
    {
      name: 'trailingIcon',
      type: 'ReactNode',
      description: 'Ícono renderizado dentro del campo, después del texto. Se ignora si type="password" (el toggle de visibilidad tiene prioridad).',
    },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el input y baja la opacidad.' },
  ],
  events: [
    {
      name: 'onInput',
      type: '(e: React.ChangeEvent<HTMLInputElement>) => void',
      description: 'Recibe el evento nativo del input. Usá e.target.value para leer el valor.',
    },
  ],
  notes: [
    'A diferencia de otros controles de la lib, onInput recibe el EVENTO NATIVO (no el valor directo). Usá e.target.value.',
    'Para type="password", trailingIcon se ignora — el toggle de visibilidad se agrega automáticamente.',
    'leadingIcon y trailingIcon aceptan cualquier ReactNode. Heroicons 24px outline funcionan sin ajuste.',
  ],
  examples: [
    {
      title: 'Texto básico',
      node: <FieldTextDemo />,
      code: '<Field label="Nombre" value={value} placeholder="Ej: Ana García"\n  onInput={(e) => setValue(e.target.value)} />',
    },
    {
      title: 'Email con ícono leading',
      node: <FieldEmailDemo />,
      code: '<Field label="Correo electrónico" type="email" value={value}\n  leadingIcon={<EnvelopeIcon />}\n  onInput={(e) => setValue(e.target.value)} />',
    },
    {
      title: 'Password con toggle',
      description: 'El ícono de ojo se agrega automáticamente cuando type="password".',
      node: <FieldPasswordDemo />,
      code: '<Field label="Contraseña" type="password" value={value}\n  leadingIcon={<LockClosedIcon />}\n  onInput={(e) => setValue(e.target.value)} />',
    },
    {
      title: 'Número con hint',
      node: <FieldNumberDemo />,
      code: '<Field label="Precio" type="number" value={value}\n  leadingIcon={<CurrencyDollarIcon />} hint="En pesos argentinos"\n  onInput={(e) => setValue(e.target.value)} />',
    },
    {
      title: 'Fecha',
      node: <FieldDateDemo />,
      code: '<Field label="Fecha de nacimiento" type="date" value={value}\n  leadingIcon={<CalendarIcon />}\n  onInput={(e) => setValue(e.target.value)} />',
    },
    {
      title: 'Tipo search',
      node: <FieldSearchDemo />,
      code: '<Field label="Buscar usuario" type="search" value={value}\n  leadingIcon={<MagnifyingGlassIcon />}\n  onInput={(e) => setValue(e.target.value)} />',
    },
    {
      title: 'Ícono leading + trailing',
      node: <FieldIconsDemo />,
      code: '<Field label="Usuario" value={value} placeholder="@handle"\n  leadingIcon={<UserIcon />} trailingIcon={<ArrowRightIcon />}\n  onInput={(e) => setValue(e.target.value)} />',
    },
    {
      title: 'Con hint',
      node: <FieldHintDemo />,
      code: '<Field label="Teléfono" type="tel" value={value}\n  leadingIcon={<PhoneIcon />} hint="Incluí código de área sin 0"\n  onInput={(e) => setValue(e.target.value)} />',
    },
    {
      title: 'Estado de error',
      node: <FieldErrorDemo />,
      code: '<Field label="Correo" type="email" value={value}\n  error="El correo no tiene un formato válido"\n  leadingIcon={<EnvelopeIcon />}\n  onInput={(e) => setValue(e.target.value)} />',
    },
    {
      title: 'Disabled',
      node: <Field label="Campo bloqueado" value="Valor no editable" disabled />,
      code: '<Field label="Campo bloqueado" value="Valor no editable" disabled />',
    },
  ],
}

const textarea: DocEntry = {
  slug: 'textarea',
  name: 'Textarea',
  category: 'Inputs',
  description: 'Área de texto multilínea con altura redimensionable. Soporta label, hint y control de filas iniciales.',
  importLine: "import { Textarea } from './lib'",
  props: [
    { name: 'label', type: 'string', default: "''", description: 'Etiqueta visible sobre el textarea.' },
    { name: 'value', type: 'string', default: "''", description: 'Valor controlado.' },
    { name: 'placeholder', type: 'string', default: "''", description: 'Texto de placeholder.' },
    { name: 'hint', type: 'string', default: "''", description: 'Texto de ayuda bajo el textarea.' },
    { name: 'rows', type: 'number', default: '4', description: 'Altura inicial en filas.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el textarea.' },
  ],
  events: [
    {
      name: 'onInput',
      type: '(value: string) => void',
      description: 'Recibe el valor directamente (string), no el evento nativo.',
    },
  ],
  notes: [
    'onInput recibe el valor (string) directamente, a diferencia de Field que recibe el evento nativo.',
    'El textarea es redimensionable verticalmente por defecto (resize: vertical).',
  ],
  examples: [
    {
      title: 'Básico',
      node: <TextareaBasicDemo />,
      code: '<Textarea label="Descripción" value={value}\n  placeholder="Escribí una descripción…" onInput={setValue} />',
    },
    {
      title: 'Con hint',
      node: <TextareaHintDemo />,
      code: '<Textarea label="Bio" value={value} placeholder="Contanos sobre vos…"\n  hint="Máximo 160 caracteres" rows={3} onInput={setValue} />',
    },
    {
      title: 'Altura extendida (rows=8)',
      node: <TextareaRowsDemo />,
      code: '<Textarea label="Comentario largo" value={value} rows={8} onInput={setValue} />',
    },
    {
      title: 'Disabled',
      node: <Textarea label="Campo bloqueado" value="Este contenido no se puede editar." disabled />,
      code: '<Textarea label="Campo bloqueado" value="Este contenido no se puede editar." disabled />',
    },
    {
      title: 'Sin label',
      node: <Textarea value="" placeholder="Escribí aquí sin encabezado…" />,
      code: '<Textarea value={value} placeholder="Escribí aquí sin encabezado…" onInput={setValue} />',
    },
  ],
}

const select: DocEntry = {
  slug: 'select',
  name: 'Select',
  category: 'Inputs',
  description: 'Selector nativo estilizado. Acepta una lista de opciones con label/value, placeholder opcional y hint de ayuda.',
  importLine: "import { Select } from './lib'",
  props: [
    { name: 'label', type: 'string', default: "''", description: 'Etiqueta visible sobre el select.' },
    { name: 'value', type: 'string', default: "''", description: 'Valor seleccionado (controlado).' },
    { name: 'options', type: 'Array<{ label: string; value: string }>', default: '[]', description: 'Lista de opciones disponibles.' },
    { name: 'placeholder', type: 'string', description: 'Opción vacía deshabilitada que actúa como hint de selección.' },
    { name: 'hint', type: 'string', default: "''", description: 'Texto de ayuda bajo el select.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el select.' },
  ],
  events: [
    { name: 'onChange', type: '(value: string) => void', description: 'Recibe el value de la opción seleccionada.' },
  ],
  examples: [
    {
      title: 'Con placeholder',
      node: <SelectBasicDemo />,
      code: "<Select label=\"País\" value={value} placeholder=\"Seleccioná un país\"\n  options={[{ label: 'Argentina', value: 'ar' }, { label: 'México', value: 'mx' }]}\n  onChange={setValue} />",
    },
    {
      title: 'Con hint',
      node: <SelectHintDemo />,
      code: '<Select label="Moneda" value={value} hint="Afecta el precio final mostrado"\n  options={opciones} onChange={setValue} />',
    },
    {
      title: 'Con valor preseleccionado',
      node: <SelectPreselectedDemo />,
      code: "<Select label=\"Categoría\" value=\"ux\" options={opciones} onChange={setValue} />",
    },
    {
      title: 'Disabled',
      node: (
        <Select label="Región" value="buenos_aires"
          options={[{ label: 'Buenos Aires', value: 'buenos_aires' }]}
          disabled />
      ),
      code: '<Select label="Región" value="buenos_aires" options={opciones} disabled />',
    },
  ],
}

const searchInput: DocEntry = {
  slug: 'search-input',
  name: 'SearchInput',
  category: 'Inputs',
  description: 'Input de búsqueda con ícono de lupa integrado y botón para limpiar que aparece al escribir.',
  importLine: "import { SearchInput } from './lib'",
  props: [
    { name: 'value', type: 'string', default: "''", description: 'Valor controlado del input.' },
    { name: 'placeholder', type: 'string', default: "'Buscar…'", description: 'Placeholder del campo.' },
  ],
  events: [
    { name: 'onInput', type: '(value: string) => void', description: 'Recibe el valor directamente cuando el usuario escribe.' },
    { name: 'onClear', type: '() => void', description: 'Callback al presionar el botón X. Se dispara además de llamar a onInput con string vacío.' },
  ],
  notes: [
    'El botón de limpiar (X) solo aparece cuando value tiene contenido.',
    'Al presionar X se llaman tanto onClear como onInput(\'\') — podés manejar el estado solo en onInput.',
  ],
  examples: [
    {
      title: 'Básico',
      node: <SearchBasicDemo />,
      code: "<SearchInput value={value} onInput={setValue} onClear={() => setValue('')} />",
    },
    {
      title: 'Placeholder personalizado y valor inicial',
      node: <SearchCustomDemo />,
      code: "<SearchInput value={value} placeholder=\"Buscá eventos…\" onInput={setValue} onClear={() => setValue('')} />",
    },
    {
      title: 'Sin callback de clear',
      description: 'onClear es opcional — el X aún llama a onInput con string vacío.',
      node: <SearchNoOnClearDemo />,
      code: '<SearchInput value={value} onInput={setValue} />',
    },
  ],
}

const slider: DocEntry = {
  slug: 'slider',
  name: 'Slider',
  category: 'Inputs',
  description: 'Slider de rango con track de progreso temático, label opcional y visualización del valor actual.',
  importLine: "import { Slider } from './lib'",
  props: [
    { name: 'value', type: 'number', default: '0', description: 'Valor actual (controlado).' },
    { name: 'min', type: 'number', default: '0', description: 'Valor mínimo.' },
    { name: 'max', type: 'number', default: '100', description: 'Valor máximo.' },
    { name: 'step', type: 'number', default: '1', description: 'Incremento de cada paso.' },
    { name: 'label', type: 'string', description: 'Etiqueta visible sobre el slider.' },
    { name: 'showValue', type: 'boolean', default: 'false', description: 'Muestra el valor numérico a la derecha del label.' },
  ],
  events: [
    { name: 'onChange', type: '(value: number) => void', description: 'Recibe el nuevo valor numérico al mover el thumb.' },
  ],
  examples: [
    {
      title: 'Con label y valor',
      node: <SliderBasicDemo />,
      code: '<Slider label="Volumen" value={value} showValue onChange={setValue} />',
    },
    {
      title: 'Rango personalizado con step',
      node: <SliderRangeDemo />,
      code: '<Slider label="Precio máximo" value={value} min={0} max={10000} step={100} showValue onChange={setValue} />',
    },
    {
      title: 'Pasos enteros (1–10)',
      node: <SliderStepsDemo />,
      code: '<Slider label="Personas" value={value} min={1} max={10} step={1} showValue onChange={setValue} />',
    },
    {
      title: 'Sin label',
      node: <SliderNoLabelDemo />,
      code: '<Slider value={value} onChange={setValue} />',
    },
  ],
}

const checkbox: DocEntry = {
  slug: 'checkbox',
  name: 'Checkbox',
  category: 'Inputs',
  description: 'Casilla de verificación accesible. Soporta label opcional como ReactNode y estado disabled.',
  importLine: "import { Checkbox } from './lib'",
  props: [
    { name: 'checked', type: 'boolean', default: 'false', description: 'Estado marcado (controlado).' },
    { name: 'label', type: 'ReactNode', description: 'Contenido visible junto al checkbox. Acepta texto o cualquier nodo.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita la interacción y baja la opacidad.' },
  ],
  events: [
    { name: 'onChange', type: '(checked: boolean) => void', description: 'Recibe el nuevo estado booleano al hacer clic.' },
  ],
  notes: [
    'El label acepta ReactNode — podés pasar texto enriquecido, íconos o cualquier elemento.',
    'Internamente usa role="checkbox" sobre un <button> para compatibilidad con lectores de pantalla.',
  ],
  examples: [
    {
      title: 'Básico',
      node: <CheckboxBasicDemo />,
      code: '<Checkbox checked={checked} label="Aceptar términos y condiciones" onChange={setChecked} />',
    },
    {
      title: 'Grupo de opciones',
      node: <CheckboxGroupDemo />,
      code: '<Checkbox checked={a} label="Notificaciones por email" onChange={setA} />\n<Checkbox checked={b} label="Notificaciones push" onChange={setB} />\n<Checkbox checked={c} label="Resumen semanal" onChange={setC} />',
    },
    {
      title: 'Sin label',
      node: <CheckboxNoLabelDemo />,
      code: '<Checkbox checked={checked} onChange={setChecked} />',
    },
    {
      title: 'Disabled marcado',
      node: <Checkbox checked label="Opción bloqueada" disabled />,
      code: '<Checkbox checked label="Opción bloqueada" disabled />',
    },
    {
      title: 'Disabled desmarcado',
      node: <Checkbox label="Opción no disponible" disabled />,
      code: '<Checkbox label="Opción no disponible" disabled />',
    },
  ],
}

const radioGroup: DocEntry = {
  slug: 'radio-group',
  name: 'RadioGroup',
  category: 'Inputs',
  description: 'Grupo de botones de radio. Selección única entre una lista de opciones etiquetadas.',
  importLine: "import { RadioGroup } from './lib'",
  props: [
    { name: 'value', type: 'string', default: "''", description: 'Valor de la opción seleccionada (controlado).' },
    { name: 'options', type: 'Array<{ label: string; value: string }>', default: '[]', description: 'Lista de opciones.' },
    { name: 'name', type: 'string', description: 'Nombre del grupo (semántico, no afecta el comportamiento visual).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita todo el grupo.' },
  ],
  events: [
    { name: 'onChange', type: '(value: string) => void', description: 'Recibe el value de la opción seleccionada.' },
  ],
  notes: [
    'Para deshabilitar opciones individuales, usá un grupo customizado.',
    'Usa role="radio" y role="radiogroup" internamente para accesibilidad.',
  ],
  examples: [
    {
      title: 'Opciones de envío',
      node: <RadioBasicDemo />,
      code: "<RadioGroup value={value}\n  options={[\n    { label: 'Estándar — gratis', value: 'standard' },\n    { label: 'Express — $500', value: 'express' },\n    { label: 'Al día siguiente — $300', value: 'next_day' },\n  ]}\n  onChange={setValue} />",
    },
    {
      title: 'Talle de ropa',
      node: <RadioSizeDemo />,
      code: "<RadioGroup value={value}\n  options={[{ label: 'S', value: 's' }, { label: 'M', value: 'm' }, { label: 'L', value: 'l' }, { label: 'XL', value: 'xl' }]}\n  onChange={setValue} />",
    },
    {
      title: 'Disabled',
      node: (
        <RadioGroup value="express"
          options={[
            { label: 'Estándar — gratis', value: 'standard' },
            { label: 'Express — $500', value: 'express' },
          ]}
          disabled />
      ),
      code: '<RadioGroup value="express" options={opciones} disabled />',
    },
  ],
}

const radioCardGroup: DocEntry = {
  slug: 'radio-card-group',
  name: 'RadioCardGroup',
  category: 'Inputs',
  description: 'Selección única renderizada como cards completas. Cada opción muestra título, descripción y precio. Ideal para planes y niveles de precio.',
  importLine: "import { RadioCardGroup } from './lib'",
  props: [
    { name: 'value', type: 'string', default: "''", description: 'Valor de la opción seleccionada (controlado).' },
    { name: 'options', type: 'Array<{ value: string; title: string; description?: string; price?: string; priceSuffix?: string; disabled?: boolean }>', default: '[]', description: 'Lista de opciones. title es la línea principal; price se pinta en el color de acento.' },
    { name: 'name', type: 'string', description: 'Nombre del grupo (semántico, no afecta el comportamiento visual).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita todo el grupo.' },
  ],
  events: [
    { name: 'onChange', type: '(value: string) => void', description: 'Recibe el value de la opción seleccionada.' },
  ],
  notes: [
    'Usa role="radio" y role="radiogroup" internamente — selección única accesible.',
    'Para deshabilitar una opción puntual, pasá disabled: true en esa option.',
    'La card seleccionada se marca con borde de acento + ícono CheckCircle.',
  ],
  examples: [
    {
      title: 'Niveles de precio',
      node: <RadioCardDemo />,
      code: "<RadioCardGroup value={value}\n  options={[\n    { value: 'box', title: 'Palco entero', description: 'Los 14 asientos, por 1 año', price: '$U 1.620.000', priceSuffix: '/año' },\n    { value: 'annual', title: 'Asiento anual', description: 'Tu butaca toda la temporada', price: '$U 118.000', priceSuffix: '/año · por asiento' },\n    { value: 'event', title: 'Asiento por evento', description: 'Una butaca para un evento puntual', price: '$U 8.200', priceSuffix: '· por asiento' },\n  ]}\n  onChange={setValue} />",
    },
    {
      title: 'Disabled',
      node: (
        <RadioCardGroup value="annual"
          options={[
            { value: 'annual', title: 'Asiento anual', description: 'Tu butaca toda la temporada', price: '$U 118.000', priceSuffix: '/año' },
            { value: 'event', title: 'Asiento por evento', description: 'Una butaca para un evento puntual', price: '$U 8.200' },
          ]}
          disabled />
      ),
      code: '<RadioCardGroup value="annual" options={opciones} disabled />',
    },
  ],
}

const toggle: DocEntry = {
  slug: 'toggle',
  name: 'Toggle',
  category: 'Inputs',
  description: 'Switch on/off animado. Ideal para preferencias y configuraciones binarias.',
  importLine: "import { Toggle } from './lib'",
  props: [
    { name: 'on', type: 'boolean', default: 'false', description: 'Estado del toggle (controlado).' },
  ],
  events: [
    {
      name: 'onToggle',
      type: '() => void',
      description: 'Se dispara al hacer clic. No recibe el nuevo estado — invertilo en el handler.',
    },
  ],
  notes: [
    'onToggle no recibe el nuevo valor. El patrón estándar es: onToggle={() => setOn(v => !v)}.',
    'El componente no tiene label propio — combinalo con un texto externo para el contexto semántico.',
  ],
  examples: [
    {
      title: 'Básico con estado',
      node: <ToggleBasicDemo />,
      code: '<Toggle on={on} onToggle={() => setOn(v => !v)} />',
    },
    {
      title: 'Lista de preferencias',
      node: <ToggleRowsDemo />,
      code: '<Toggle on={on} onToggle={() => setOn(v => !v)} />',
    },
    {
      title: 'Estado on (estático)',
      node: <Toggle on />,
      code: '<Toggle on />',
    },
    {
      title: 'Estado off (estático)',
      node: <Toggle on={false} />,
      code: '<Toggle on={false} />',
    },
  ],
}

const quantityStepper: DocEntry = {
  slug: 'quantity-stepper',
  name: 'QuantityStepper',
  category: 'Inputs',
  description: 'Contador numérico con botones +/−. Diseñado para cantidades de productos, entradas o asientos con límites configurables.',
  importLine: "import { QuantityStepper } from './lib'",
  props: [
    { name: 'value', type: 'number', default: '0', description: 'Valor actual (controlado).' },
    { name: 'min', type: 'number', default: '0', description: 'Valor mínimo. El botón − se deshabilita al alcanzarlo.' },
    { name: 'max', type: 'number', default: '99', description: 'Valor máximo. El botón + se deshabilita al alcanzarlo.' },
    { name: 'step', type: 'number', default: '1', description: 'Cuánto incrementa o decrementa cada clic.' },
  ],
  events: [
    { name: 'onChange', type: '(value: number) => void', description: 'Recibe el nuevo valor ya clampeado entre min y max.' },
  ],
  notes: [
    'Los botones +/− se deshabilitan automáticamente al llegar al límite.',
    'El valor en onChange ya está clampeado — no necesitás validarlo externamente.',
  ],
  examples: [
    {
      title: 'Cantidad de entradas (1–10)',
      node: <QuantityBasicDemo />,
      code: '<QuantityStepper value={value} min={1} max={10} onChange={setValue} />',
    },
    {
      title: 'Pasos de a 5',
      node: <QuantityStepDemo />,
      code: '<QuantityStepper value={value} min={0} max={100} step={5} onChange={setValue} />',
    },
    {
      title: 'Desde cero',
      node: <QuantityZeroDemo />,
      code: '<QuantityStepper value={value} min={0} max={99} onChange={setValue} />',
    },
    {
      title: 'En límite superior (botón + deshabilitado)',
      node: <QuantityStepper value={10} min={1} max={10} onChange={() => {}} />,
      code: '<QuantityStepper value={10} min={1} max={10} onChange={setValue} />',
    },
    {
      title: 'En límite inferior (botón − deshabilitado)',
      node: <QuantityStepper value={0} min={0} max={10} onChange={() => {}} />,
      code: '<QuantityStepper value={0} min={0} max={10} onChange={setValue} />',
    },
  ],
}

const segmentedControl: DocEntry = {
  slug: 'segmented-control',
  name: 'SegmentedControl',
  category: 'Inputs',
  description: 'Selector de opción única en forma de pestañas adjuntas. Ideal para cambiar vistas, filtros o períodos de tiempo.',
  importLine: "import { SegmentedControl } from './lib'",
  props: [
    { name: 'segments', type: 'Array<{ value: string; label: string }>', default: '[]', description: 'Lista de segmentos disponibles.' },
    { name: 'value', type: 'string', default: "''", description: 'Valor del segmento activo (controlado).' },
    { name: 'block', type: 'boolean', default: 'false', description: 'Ocupa el ancho completo del contenedor.' },
  ],
  events: [
    { name: 'onChange', type: '(value: string) => void', description: 'Recibe el value del segmento seleccionado.' },
  ],
  examples: [
    {
      title: 'Vista de contenido',
      node: <SegmentedBasicDemo />,
      code: "<SegmentedControl value={value}\n  segments={[{ label: 'Lista', value: 'list' }, { label: 'Cuadrícula', value: 'grid' }, { label: 'Mapa', value: 'map' }]}\n  onChange={setValue} />",
    },
    {
      title: 'Selector de período',
      node: <SegmentedTwoDemo />,
      code: "<SegmentedControl value={value}\n  segments={[{ label: 'Mes', value: 'month' }, { label: 'Semana', value: 'week' }]}\n  onChange={setValue} />",
    },
    {
      title: 'Block (ancho completo)',
      node: <SegmentedBlockDemo />,
      code: "<SegmentedControl value={value} block\n  segments={[{ label: 'Entradas', value: 'tickets' }, { label: 'Artistas', value: 'artists' }, { label: 'Venue', value: 'venue' }]}\n  onChange={setValue} />",
    },
    {
      title: 'Par on/off',
      node: <SegmentedStatusDemo />,
      code: "<SegmentedControl value={value}\n  segments={[{ label: 'Activo', value: 'on' }, { label: 'Pausado', value: 'off' }]}\n  onChange={setValue} />",
    },
  ],
}

const fileDropzone: DocEntry = {
  slug: 'file-dropzone',
  name: 'FileDropzone',
  category: 'Inputs',
  description: 'Zona de carga de archivos con soporte para drag & drop y clic para seleccionar. El estado de hover se anima automáticamente.',
  importLine: "import { FileDropzone } from './lib'",
  props: [
    {
      name: 'hint',
      type: 'string',
      default: "'Arrastrá archivos o hacé clic para subir'",
      description: 'Texto descriptivo dentro del dropzone.',
    },
    {
      name: 'accept',
      type: 'string',
      description: "MIME types o extensiones aceptadas (igual al atributo accept nativo, ej: \"image/*\", \".pdf\").",
    },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Permite seleccionar más de un archivo.' },
  ],
  events: [
    {
      name: 'onFiles',
      type: '(files: File[]) => void',
      description: 'Recibe el array de File seleccionados, tanto por clic como por drag & drop.',
    },
  ],
  notes: [
    'onFiles recibe File[] de ambas fuentes (selector y drag & drop) — no necesitás manejarlos por separado.',
    'El dropzone no gestiona estado de archivos ni muestra previews — manejalo en el componente padre.',
  ],
  examples: [
    {
      title: 'Básico',
      node: <FileDropzoneBasicDemo />,
      code: '<FileDropzone onFiles={setFiles} />',
    },
    {
      title: 'Múltiples imágenes',
      node: <FileDropzoneMultipleDemo />,
      code: '<FileDropzone multiple hint="Arrastrá o seleccioná imágenes (PNG, JPG)" accept="image/*" onFiles={setFiles} />',
    },
    {
      title: 'Solo PDF',
      node: <FileDropzone accept=".pdf" hint="Subí tu CV en PDF" />,
      code: '<FileDropzone accept=".pdf" hint="Subí tu CV en PDF" />',
    },
    {
      title: 'Hint personalizado con restricciones',
      node: <FileDropzone hint="Subí el comprobante de pago (JPG, PNG, PDF — máx 5 MB)" accept=".jpg,.jpeg,.png,.pdf" />,
      code: '<FileDropzone hint="Subí el comprobante de pago (JPG, PNG, PDF — máx 5 MB)" accept=".jpg,.jpeg,.png,.pdf" />',
    },
    {
      title: 'Sin callback (solo UI)',
      node: <FileDropzone />,
      code: '<FileDropzone />',
    },
  ],
}

// ─── Export ────────────────────────────────────────────────────────────────

const entries: DocEntry[] = [
  field,
  textarea,
  select,
  searchInput,
  slider,
  checkbox,
  radioGroup,
  radioCardGroup,
  toggle,
  quantityStepper,
  segmentedControl,
  fileDropzone,
]

export default entries
