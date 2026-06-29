import { useState } from 'react'
import type { DocEntry } from '../types'
import NumberInput from '../../NumberInput'
import PinInput from '../../PinInput'
import Combobox from '../../Combobox'
import MultiSelect from '../../MultiSelect'
import ColorPicker from '../../ColorPicker'
import Editable from '../../Editable'
import CopyButton from '../../CopyButton'

// ─── NumberInput demos ────────────────────────────────────────────────────────

function NumberInputBasic() {
  const [v, setV] = useState(5)
  return <NumberInput value={v} min={0} max={20} onChange={setV} label="Cantidad" />
}
function NumberInputStep() {
  const [v, setV] = useState(0)
  return <NumberInput value={v} step={5} min={0} max={100} onChange={setV} label="Paso de 5" />
}
function NumberInputNoClamp() {
  const [v, setV] = useState(42)
  return <NumberInput value={v} onChange={setV} label="Sin límites" />
}
function NumberInputDisabled() {
  return <NumberInput value={10} min={0} max={20} onChange={() => {}} label="Deshabilitado" disabled />
}
function NumberInputNegative() {
  const [v, setV] = useState(0)
  return <NumberInput value={v} min={-50} max={50} step={10} onChange={setV} label="Temperatura (°C)" />
}

// ─── PinInput demos ───────────────────────────────────────────────────────────

function PinInputBasic() {
  const [v, setV] = useState('')
  return <PinInput value={v} onChange={setV} label="Código PIN" />
}
function PinInputMasked() {
  const [v, setV] = useState('')
  return <PinInput value={v} onChange={setV} mask label="Contraseña numérica" />
}
function PinInputLength6() {
  const [v, setV] = useState('')
  return <PinInput length={6} value={v} onChange={setV} label="Código de 6 dígitos" />
}
function PinInputControlled() {
  const [v, setV] = useState('12')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <PinInput length={4} value={v} onChange={setV} label="Valor controlado" />
      <span style={{ fontFamily: 'Archivo', fontSize: 13, color: 'var(--subtle-foreground,#6B7480)' }}>Valor actual: "{v}"</span>
    </div>
  )
}
function PinInputPaste() {
  const [v, setV] = useState('')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <PinInput length={6} value={v} onChange={setV} label="Probá pegar 123456" />
    </div>
  )
}

// ─── Combobox demos ───────────────────────────────────────────────────────────

const FRUITS = [
  { label: 'Manzana', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cereza', value: 'cherry' },
  { label: 'Durazno', value: 'peach' },
  { label: 'Frambuesa', value: 'raspberry' },
  { label: 'Kiwi', value: 'kiwi' },
  { label: 'Limón', value: 'lemon' },
  { label: 'Mango', value: 'mango' },
  { label: 'Naranja', value: 'orange' },
  { label: 'Pera', value: 'pear' },
]

function ComboboxBasic() {
  const [v, setV] = useState('')
  return <Combobox options={FRUITS} value={v} onChange={setV} label="Fruta" placeholder="Buscar..." />
}
function ComboboxPreselected() {
  const [v, setV] = useState('mango')
  return <Combobox options={FRUITS} value={v} onChange={setV} label="Con valor inicial" />
}
function ComboboxEmpty() {
  const [v, setV] = useState('')
  return <Combobox options={[]} value={v} onChange={setV} label="Sin opciones" placeholder="Lista vacía" />
}
function ComboboxShowSelected() {
  const [v, setV] = useState('')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Combobox options={FRUITS} value={v} onChange={setV} label="Selección activa" />
      {v && <span style={{ fontFamily: 'Archivo', fontSize: 13, color: 'var(--subtle-foreground,#6B7480)' }}>Elegiste: {v}</span>}
    </div>
  )
}
function ComboboxMany() {
  const countries = [
    { label: 'Argentina', value: 'ar' }, { label: 'Brasil', value: 'br' },
    { label: 'Chile', value: 'cl' }, { label: 'Colombia', value: 'co' },
    { label: 'Ecuador', value: 'ec' }, { label: 'México', value: 'mx' },
    { label: 'Paraguay', value: 'py' }, { label: 'Perú', value: 'pe' },
    { label: 'Uruguay', value: 'uy' }, { label: 'Venezuela', value: 've' },
  ]
  const [v, setV] = useState('')
  return <Combobox options={countries} value={v} onChange={setV} label="País" placeholder="Buscar país..." />
}

// ─── MultiSelect demos ────────────────────────────────────────────────────────

const TAGS = [
  { label: 'React', value: 'react' }, { label: 'TypeScript', value: 'ts' },
  { label: 'Node.js', value: 'node' }, { label: 'GraphQL', value: 'gql' },
  { label: 'Postgres', value: 'pg' }, { label: 'Redis', value: 'redis' },
  { label: 'Docker', value: 'docker' }, { label: 'AWS', value: 'aws' },
]

function MultiSelectBasic() {
  const [v, setV] = useState<string[]>([])
  return <MultiSelect options={TAGS} value={v} onChange={setV} label="Tecnologías" />
}
function MultiSelectPreselected() {
  const [v, setV] = useState(['react', 'ts'])
  return <MultiSelect options={TAGS} value={v} onChange={setV} label="Con selección inicial" />
}
function MultiSelectShowCount() {
  const [v, setV] = useState<string[]>([])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <MultiSelect options={TAGS} value={v} onChange={setV} label="Seleccionadas" placeholder="Elegir tecnologías..." />
      <span style={{ fontFamily: 'Archivo', fontSize: 13, color: 'var(--subtle-foreground,#6B7480)' }}>{v.length} seleccionadas</span>
    </div>
  )
}
function MultiSelectAllSelected() {
  const [v, setV] = useState(TAGS.map(t => t.value))
  return <MultiSelect options={TAGS} value={v} onChange={setV} label="Todas seleccionadas" />
}
function MultiSelectEmpty() {
  const [v, setV] = useState<string[]>([])
  return <MultiSelect options={[]} value={v} onChange={setV} label="Lista vacía" />
}

// ─── ColorPicker demos ────────────────────────────────────────────────────────

function ColorPickerBasic() {
  const [v, setV] = useState('#C9A24B')
  return <ColorPicker value={v} onChange={setV} label="Color de marca" />
}
function ColorPickerCustomSwatches() {
  const [v, setV] = useState('#FF6B6B')
  const swatches = ['#FF6B6B','#FFA07A','#FFD700','#90EE90','#4169E1','#9370DB','#FF69B4','#20B2AA']
  return <ColorPicker value={v} onChange={setV} swatches={swatches} label="Paleta personalizada" />
}
function ColorPickerShowHex() {
  const [v, setV] = useState('#4A9E71')
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <ColorPicker value={v} onChange={setV} label="Color" />
      <span style={{ fontFamily: "'Space Mono'", fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)', marginTop: 22 }}>{v}</span>
    </div>
  )
}
function ColorPickerDanger() {
  const [v, setV] = useState('#E5604D')
  return <ColorPicker value={v} onChange={setV} label="Color de alerta" />
}
function ColorPickerHexInput() {
  const [v, setV] = useState('#5B8BE0')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <ColorPicker value={v} onChange={setV} label="Ingresá un hex manualmente" />
      <span style={{ fontFamily: 'Archivo', fontSize: 12, color: 'var(--subtle-foreground,#6B7480)' }}>Abrí el picker y editá el campo HEX</span>
    </div>
  )
}

// ─── Editable demos ───────────────────────────────────────────────────────────

function EditableBasic() {
  const [v, setV] = useState('Mi título editable')
  return <Editable value={v} onSave={setV} />
}
function EditableWithPlaceholder() {
  const [v, setV] = useState('')
  return <Editable value={v} onSave={setV} placeholder="Hacer clic para editar..." />
}
function EditableLongText() {
  const [v, setV] = useState('Este es un texto más largo que puede ser editado en línea')
  return <Editable value={v} onSave={setV} />
}
function EditableWithLog() {
  const [v, setV] = useState('Nombre del proyecto')
  const [last, setLast] = useState('')
  function handleSave(val: string) { setV(val); setLast(val) }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Editable value={v} onSave={handleSave} />
      {last && <span style={{ fontFamily: 'Archivo', fontSize: 12, color: 'var(--subtle-foreground,#6B7480)' }}>Último guardado: "{last}"</span>}
    </div>
  )
}
function EditableEscapeCancel() {
  const [v, setV] = useState('Presioná Esc para cancelar')
  return <Editable value={v} onSave={setV} />
}

// ─── CopyButton demos ─────────────────────────────────────────────────────────

function CopyButtonBasic() {
  return <CopyButton text="npm install @palqueate/ui" />
}
function CopyButtonCustomLabel() {
  return <CopyButton text="git clone https://github.com/palqueate/app" label="Copiar URL" />
}
function CopyButtonCode() {
  const snippet = `import { Btn } from './lib'`
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <code style={{ fontFamily: "'Space Mono'", fontSize: 13, color: 'var(--muted-foreground,#9AA6B2)', background: 'var(--muted,#1F2530)', padding: '6px 10px', borderRadius: 8 }}>{snippet}</code>
      <CopyButton text={snippet} label="Copiar" />
    </div>
  )
}
function CopyButtonApiKey() {
  return <CopyButton text="sk-palqueate-prod-abc123xyz789" label="Copiar clave" />
}
function CopyButtonMultiple() {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <CopyButton text="https://palqueate.com" label="URL" />
      <CopyButton text="equipo@palqueate.com" label="Email" />
      <CopyButton text="+54 11 1234-5678" label="Teléfono" />
    </div>
  )
}

// ─── Entries ──────────────────────────────────────────────────────────────────

const entries: DocEntry[] = [
  {
    slug: 'number-input',
    name: 'NumberInput',
    category: 'Inputs',
    description: 'Input numérico controlado con botones de decremento e incremento. Soporta límites mínimo/máximo, paso personalizado y estado deshabilitado.',
    importLine: "import NumberInput from './lib/NumberInput'",
    props: [
      { name: 'value', type: 'number', required: true, description: 'Valor actual del input.' },
      { name: 'onChange', type: '(n: number) => void', required: true, description: 'Se llama con el nuevo valor cada vez que cambia.' },
      { name: 'min', type: 'number', description: 'Valor mínimo. El botón − se deshabilita al alcanzarlo.' },
      { name: 'max', type: 'number', description: 'Valor máximo. El botón + se deshabilita al alcanzarlo.' },
      { name: 'step', type: 'number', default: '1', description: 'Incremento/decremento por cada clic de botón.' },
      { name: 'label', type: 'string', description: 'Etiqueta superior en Space Mono uppercase.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el componente completo.' },
    ],
    notes: [
      'El input acepta ingreso manual con teclado; el valor se clampea al perder el foco si está fuera de rango.',
      'Usa type="text" inputMode="numeric" para evitar las flechas nativas del navegador.',
    ],
    examples: [
      {
        title: 'Básico con rango',
        node: <NumberInputBasic />,
        code: `const [v, setV] = useState(5)\n<NumberInput value={v} min={0} max={20} onChange={setV} label="Cantidad" />`,
      },
      {
        title: 'Paso personalizado',
        node: <NumberInputStep />,
        code: `<NumberInput value={v} step={5} min={0} max={100} onChange={setV} label="Paso de 5" />`,
      },
      {
        title: 'Sin límites',
        node: <NumberInputNoClamp />,
        code: `<NumberInput value={v} onChange={setV} label="Sin límites" />`,
      },
      {
        title: 'Valores negativos',
        node: <NumberInputNegative />,
        code: `<NumberInput value={v} min={-50} max={50} step={10} onChange={setV} label="Temperatura (°C)" />`,
      },
      {
        title: 'Deshabilitado',
        node: <NumberInputDisabled />,
        code: `<NumberInput value={10} min={0} max={20} onChange={() => {}} label="Deshabilitado" disabled />`,
      },
    ],
  },

  {
    slug: 'pin-input',
    name: 'PinInput',
    category: 'Inputs',
    description: 'Cajas individuales para ingresar un PIN o código numérico. Avance automático al escribir, retroceso con Backspace y soporte de pegado.',
    importLine: "import PinInput from './lib/PinInput'",
    props: [
      { name: 'value', type: 'string', required: true, description: 'Valor actual (string de dígitos).' },
      { name: 'onChange', type: '(v: string) => void', required: true, description: 'Se llama con el string completo actualizado.' },
      { name: 'length', type: 'number', default: '4', description: 'Cantidad de cajas.' },
      { name: 'mask', type: 'boolean', default: 'false', description: 'Oculta los caracteres como contraseña.' },
      { name: 'label', type: 'string', description: 'Etiqueta superior en Space Mono uppercase.' },
    ],
    notes: [
      'Solo acepta dígitos numéricos; los no-numéricos se ignoran al tipear y pegar.',
      'El pegado distribuye los dígitos desde la caja activa hacia adelante.',
      'ArrowLeft/ArrowRight también navegan entre cajas.',
    ],
    examples: [
      {
        title: 'PIN de 4 dígitos',
        node: <PinInputBasic />,
        code: `const [v, setV] = useState('')\n<PinInput value={v} onChange={setV} label="Código PIN" />`,
      },
      {
        title: 'Enmascarado',
        node: <PinInputMasked />,
        code: `<PinInput value={v} onChange={setV} mask label="Contraseña numérica" />`,
      },
      {
        title: '6 dígitos',
        node: <PinInputLength6 />,
        code: `<PinInput length={6} value={v} onChange={setV} label="Código de 6 dígitos" />`,
      },
      {
        title: 'Valor controlado',
        node: <PinInputControlled />,
        code: `const [v, setV] = useState('12')\n<PinInput length={4} value={v} onChange={setV} label="Valor controlado" />`,
      },
      {
        title: 'Soporte de pegado',
        node: <PinInputPaste />,
        description: 'Pegá "123456" en la primera caja — se distribuye automáticamente.',
        code: `<PinInput length={6} value={v} onChange={setV} label="Probá pegar 123456" />`,
      },
    ],
  },

  {
    slug: 'combobox',
    name: 'Combobox',
    category: 'Inputs',
    description: 'Input de texto que filtra opciones en tiempo real. Soporta navegación con teclado (↑↓ Enter Esc) y cierre al hacer clic fuera.',
    importLine: "import Combobox from './lib/Combobox'",
    props: [
      { name: 'options', type: '{ label: string; value: string }[]', required: true, description: 'Lista completa de opciones.' },
      { name: 'value', type: 'string', required: true, description: 'Valor seleccionado actualmente.' },
      { name: 'onChange', type: '(v: string) => void', required: true, description: 'Se llama con el value de la opción seleccionada.' },
      { name: 'placeholder', type: 'string', default: "'Seleccionar...'", description: 'Texto cuando no hay selección.' },
      { name: 'label', type: 'string', description: 'Etiqueta superior en Space Mono uppercase.' },
    ],
    notes: [
      'Al hacer foco, el dropdown se abre y el campo se limpia para escribir el filtro.',
      'Al cerrar sin seleccionar, el campo vuelve a mostrar la opción previamente seleccionada.',
      'El filtrado es case-insensitive sobre el label de cada opción.',
    ],
    examples: [
      {
        title: 'Básico',
        node: <ComboboxBasic />,
        code: `const [v, setV] = useState('')\n<Combobox options={fruits} value={v} onChange={setV} label="Fruta" placeholder="Buscar..." />`,
      },
      {
        title: 'Con valor preseleccionado',
        node: <ComboboxPreselected />,
        code: `const [v, setV] = useState('mango')\n<Combobox options={fruits} value={v} onChange={setV} label="Con valor inicial" />`,
      },
      {
        title: 'Muchas opciones',
        node: <ComboboxMany />,
        code: `<Combobox options={countries} value={v} onChange={setV} label="País" placeholder="Buscar país..." />`,
      },
      {
        title: 'Muestra selección',
        node: <ComboboxShowSelected />,
        code: `<Combobox options={fruits} value={v} onChange={setV} label="Selección activa" />\n{v && <span>Elegiste: {v}</span>}`,
      },
      {
        title: 'Lista vacía',
        node: <ComboboxEmpty />,
        code: `<Combobox options={[]} value={v} onChange={setV} label="Sin opciones" />`,
      },
    ],
  },

  {
    slug: 'multi-select',
    name: 'MultiSelect',
    category: 'Inputs',
    description: 'Selector múltiple con chips removibles dentro del control. El dropdown muestra todas las opciones con checkboxes visuales.',
    importLine: "import MultiSelect from './lib/MultiSelect'",
    props: [
      { name: 'options', type: '{ label: string; value: string }[]', required: true, description: 'Lista completa de opciones disponibles.' },
      { name: 'value', type: 'string[]', required: true, description: 'Array de values seleccionados.' },
      { name: 'onChange', type: '(v: string[]) => void', required: true, description: 'Se llama con el array actualizado.' },
      { name: 'placeholder', type: 'string', default: "'Seleccionar...'", description: 'Texto cuando no hay selección.' },
      { name: 'label', type: 'string', description: 'Etiqueta superior en Space Mono uppercase.' },
    ],
    notes: [
      'Los chips del control tienen botón × para remover individualmente sin abrir el dropdown.',
      'El control crece en altura cuando hay muchas selecciones (flexWrap).',
      'El click en el × del chip llama stopPropagation para no re-abrir el dropdown.',
    ],
    examples: [
      {
        title: 'Selección múltiple',
        node: <MultiSelectBasic />,
        code: `const [v, setV] = useState([])\n<MultiSelect options={tags} value={v} onChange={setV} label="Tecnologías" />`,
      },
      {
        title: 'Con valores iniciales',
        node: <MultiSelectPreselected />,
        code: `const [v, setV] = useState(['react', 'ts'])\n<MultiSelect options={tags} value={v} onChange={setV} />`,
      },
      {
        title: 'Muestra contador',
        node: <MultiSelectShowCount />,
        code: `<MultiSelect options={tags} value={v} onChange={setV} label="Seleccionadas" />\n<span>{v.length} seleccionadas</span>`,
      },
      {
        title: 'Todas seleccionadas',
        node: <MultiSelectAllSelected />,
        code: `const [v, setV] = useState(tags.map(t => t.value))\n<MultiSelect options={tags} value={v} onChange={setV} />`,
      },
      {
        title: 'Sin opciones',
        node: <MultiSelectEmpty />,
        code: `<MultiSelect options={[]} value={[]} onChange={setV} label="Lista vacía" />`,
      },
    ],
  },

  {
    slug: 'color-picker',
    name: 'ColorPicker',
    category: 'Inputs',
    description: 'Botón swatch que abre un popover con grilla de colores predefinidos y un campo de entrada hex. Soporta paletas personalizadas.',
    importLine: "import ColorPicker from './lib/ColorPicker'",
    props: [
      { name: 'value', type: 'string', required: true, description: 'Color actual en formato hex (#RRGGBB).' },
      { name: 'onChange', type: '(hex: string) => void', required: true, description: 'Se llama con el nuevo hex al seleccionar un swatch o confirmar el input.' },
      { name: 'label', type: 'string', description: 'Etiqueta superior en Space Mono uppercase.' },
      { name: 'swatches', type: 'string[]', description: 'Paleta personalizada de colores hex. Por defecto incluye 12 colores del sistema.' },
    ],
    notes: [
      'El campo HEX solo dispara onChange al perder el foco (onBlur) y solo si el valor es un hex de 6 dígitos válido.',
      'Seleccionar un swatch cierra el popover inmediatamente.',
      'El swatch activo se destaca con borde brand.',
    ],
    examples: [
      {
        title: 'Color de marca',
        node: <ColorPickerBasic />,
        code: `const [v, setV] = useState('#C9A24B')\n<ColorPicker value={v} onChange={setV} label="Color de marca" />`,
      },
      {
        title: 'Paleta personalizada',
        node: <ColorPickerCustomSwatches />,
        code: `<ColorPicker value={v} onChange={setV} swatches={['#FF6B6B','#FFA07A','#FFD700','#90EE90',...]} />`,
      },
      {
        title: 'Muestra hex seleccionado',
        node: <ColorPickerShowHex />,
        code: `<ColorPicker value={v} onChange={setV} label="Color" />\n<span>{v}</span>`,
      },
      {
        title: 'Color de peligro',
        node: <ColorPickerDanger />,
        code: `<ColorPicker value="#E5604D" onChange={setV} label="Color de alerta" />`,
      },
      {
        title: 'Input hex manual',
        description: 'Abrí el picker y editá el campo HEX directamente.',
        node: <ColorPickerHexInput />,
        code: `<ColorPicker value={v} onChange={setV} label="Ingresá un hex manualmente" />`,
      },
    ],
  },

  {
    slug: 'editable',
    name: 'Editable',
    category: 'Inputs',
    description: 'Texto editable en línea. Muestra un lápiz al hacer hover; al hacer clic activa un input con botones de guardar y cancelar.',
    importLine: "import Editable from './lib/Editable'",
    props: [
      { name: 'value', type: 'string', required: true, description: 'Texto actual mostrado.' },
      { name: 'onSave', type: '(v: string) => void', required: true, description: 'Se llama con el nuevo valor al confirmar (Enter o clic en ✓).' },
      { name: 'placeholder', type: 'string', description: 'Texto mostrado cuando value está vacío.' },
    ],
    events: [
      { name: 'onSave', type: '(v: string) => void', description: 'El valor se trimea antes de pasarse.' },
    ],
    notes: [
      'Enter guarda, Escape cancela sin llamar a onSave.',
      'El componente es no-controlado en modo edición — maneja su propio draft.',
      'El ícono de lápiz aparece con transición de opacidad al hacer hover.',
    ],
    examples: [
      {
        title: 'Edición en línea',
        node: <EditableBasic />,
        code: `const [v, setV] = useState('Mi título editable')\n<Editable value={v} onSave={setV} />`,
      },
      {
        title: 'Con placeholder',
        node: <EditableWithPlaceholder />,
        code: `<Editable value={v} onSave={setV} placeholder="Hacer clic para editar..." />`,
      },
      {
        title: 'Texto largo',
        node: <EditableLongText />,
        code: `<Editable value="Este es un texto más largo que puede ser editado en línea" onSave={setV} />`,
      },
      {
        title: 'Con log de guardado',
        node: <EditableWithLog />,
        code: `<Editable value={v} onSave={(val) => { setV(val); setLast(val) }} />`,
      },
      {
        title: 'Cancelar con Esc',
        description: 'Hacé clic para editar, cambiá el texto y presioná Esc para cancelar.',
        node: <EditableEscapeCancel />,
        code: `<Editable value={v} onSave={setV} />`,
      },
    ],
  },

  {
    slug: 'copy-button',
    name: 'CopyButton',
    category: 'Acciones',
    description: 'Botón que copia texto al portapapeles y muestra feedback visual por 1.5 segundos. Sin dependencias externas.',
    importLine: "import CopyButton from './lib/CopyButton'",
    props: [
      { name: 'text', type: 'string', required: true, description: 'Texto a copiar al portapapeles.' },
      { name: 'label', type: 'string', default: "'Copiar'", description: 'Texto del botón en estado inactivo.' },
    ],
    notes: [
      'Usa navigator.clipboard.writeText — requiere contexto seguro (HTTPS o localhost).',
      'El timer de 1.5s se limpia en el unmount del componente para evitar fugas de memoria.',
      'El ícono cambia de clipboard a checkmark durante el estado "copiado".',
    ],
    examples: [
      {
        title: 'Básico',
        node: <CopyButtonBasic />,
        code: `<CopyButton text="npm install @palqueate/ui" />`,
      },
      {
        title: 'Label personalizado',
        node: <CopyButtonCustomLabel />,
        code: `<CopyButton text="git clone https://..." label="Copiar URL" />`,
      },
      {
        title: 'Junto a un snippet de código',
        node: <CopyButtonCode />,
        code: `<CopyButton text={\`import { Btn } from './lib'\`} label="Copiar" />`,
      },
      {
        title: 'Clave de API',
        node: <CopyButtonApiKey />,
        code: `<CopyButton text="sk-palqueate-prod-abc123xyz789" label="Copiar clave" />`,
      },
      {
        title: 'Múltiples instancias',
        node: <CopyButtonMultiple />,
        code: `<CopyButton text="https://palqueate.com" label="URL" />\n<CopyButton text="equipo@palqueate.com" label="Email" />\n<CopyButton text="+54 11 1234-5678" label="Teléfono" />`,
      },
    ],
  },
]

export default entries
