import type { DocEntry } from '../types'
import { Btn, IconButton } from '../../index'
import {
  ArrowRightIcon, PlusIcon, TrashIcon, MagnifyingGlassIcon, EnvelopeIcon,
  HeartIcon, CheckIcon, AdjustmentsHorizontalIcon, ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

const button: DocEntry = {
  slug: 'button',
  name: 'Btn',
  category: 'Acciones',
  description: 'Botón principal de acción. Cuatro variantes, tres tamaños y slots de ícono leading/trailing que aceptan cualquier nodo (Heroicons, SVG propio, etc).',
  importLine: "import { Btn } from './lib'",
  props: [
    { name: 'label', type: 'string', default: "''", description: 'Texto del botón. Si se omite, queda solo el ícono.' },
    { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", default: "'primary'", description: 'Estilo visual del botón.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Tamaño (alto, padding y tipografía).' },
    { name: 'leadingIcon', type: 'ReactNode', description: 'Ícono renderizado antes del label. Gana sobre el enum icon.' },
    { name: 'trailingIcon', type: 'ReactNode', description: 'Ícono renderizado después del label.' },
    { name: 'icon', type: "'arrow' | 'plus' | 'cart' | …", default: "'none'", description: 'Set de íconos integrado (legacy). Preferí leadingIcon/trailingIcon.' },
    { name: 'block', type: 'boolean', default: 'false', description: 'Ocupa todo el ancho disponible.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita e baja la opacidad.' },
  ],
  events: [
    { name: 'onClick', type: '() => void', description: 'Se dispara al hacer clic (salvo disabled).' },
  ],
  examples: [
    {
      title: 'Variantes',
      node: <>
        <Btn label="Primary" variant="primary" />
        <Btn label="Secondary" variant="secondary" />
        <Btn label="Ghost" variant="ghost" />
        <Btn label="Danger" variant="danger" />
      </>,
      code: '<Btn label="Primary" variant="primary" />\n<Btn label="Secondary" variant="secondary" />\n<Btn label="Ghost" variant="ghost" />\n<Btn label="Danger" variant="danger" />',
    },
    {
      title: 'Tamaños',
      node: <>
        <Btn label="Small" size="sm" />
        <Btn label="Medium" size="md" />
        <Btn label="Large" size="lg" />
      </>,
      code: '<Btn label="Small" size="sm" />\n<Btn label="Medium" size="md" />\n<Btn label="Large" size="lg" />',
    },
    {
      title: 'Ícono leading',
      description: 'Cualquier nodo. Acá Heroicons.',
      node: <>
        <Btn label="Buscar" leadingIcon={<MagnifyingGlassIcon />} variant="secondary" />
        <Btn label="Correo" leadingIcon={<EnvelopeIcon />} variant="primary" />
        <Btn label="Agregar" leadingIcon={<PlusIcon />} variant="secondary" />
        <Btn label="Eliminar" leadingIcon={<TrashIcon />} variant="danger" />
      </>,
      code: '<Btn label="Buscar" leadingIcon={<MagnifyingGlassIcon />} variant="secondary" />',
    },
    {
      title: 'Ícono trailing',
      node: <>
        <Btn label="Siguiente" trailingIcon={<ArrowRightIcon />} />
        <Btn label="Descargar" trailingIcon={<ArrowDownTrayIcon />} variant="secondary" />
      </>,
      code: '<Btn label="Siguiente" trailingIcon={<ArrowRightIcon />} />',
    },
    {
      title: 'Solo ícono',
      description: 'Sin label.',
      node: <>
        <Btn variant="primary" leadingIcon={<HeartIcon />} />
        <Btn variant="secondary" leadingIcon={<PlusIcon />} />
        <Btn variant="danger" leadingIcon={<TrashIcon />} />
      </>,
      code: '<Btn variant="primary" leadingIcon={<HeartIcon />} />',
    },
    {
      title: 'Block',
      node: <div style={{ width: '100%' }}><Btn label="Ancho completo" block leadingIcon={<CheckIcon />} /></div>,
      code: '<Btn label="Ancho completo" block />',
    },
    {
      title: 'Disabled',
      node: <>
        <Btn label="Primary" disabled />
        <Btn label="Secondary" variant="secondary" disabled />
      </>,
      code: '<Btn label="Primary" disabled />',
    },
  ],
}

const iconButton: DocEntry = {
  slug: 'icon-button',
  name: 'IconButton',
  category: 'Acciones',
  description: 'Botón cuadrado de un solo ícono. Cuatro variantes y tres tamaños. Requiere aria-label por accesibilidad.',
  importLine: "import { IconButton } from './lib'",
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'El ícono a renderizar.' },
    { name: 'aria-label', type: 'string', required: true, description: 'Etiqueta accesible obligatoria.' },
    { name: 'variant', type: "'solid' | 'soft' | 'ghost' | 'outline'", default: "'soft'", description: 'Estilo visual.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Tamaño del cuadrado (34 / 40 / 46px).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el botón.' },
  ],
  events: [
    { name: 'onClick', type: '() => void', description: 'Se dispara al hacer clic.' },
  ],
  examples: [
    {
      title: 'Variantes',
      node: <>
        <IconButton aria-label="Solid" variant="solid"><HeartIcon /></IconButton>
        <IconButton aria-label="Soft" variant="soft"><HeartIcon /></IconButton>
        <IconButton aria-label="Outline" variant="outline"><HeartIcon /></IconButton>
        <IconButton aria-label="Ghost" variant="ghost"><HeartIcon /></IconButton>
      </>,
      code: '<IconButton aria-label="Solid" variant="solid"><HeartIcon /></IconButton>',
    },
    {
      title: 'Tamaños',
      node: <>
        <IconButton aria-label="sm" size="sm" variant="soft"><AdjustmentsHorizontalIcon /></IconButton>
        <IconButton aria-label="md" size="md" variant="soft"><AdjustmentsHorizontalIcon /></IconButton>
        <IconButton aria-label="lg" size="lg" variant="soft"><AdjustmentsHorizontalIcon /></IconButton>
      </>,
      code: '<IconButton aria-label="Ajustes" size="lg"><AdjustmentsHorizontalIcon /></IconButton>',
    },
    {
      title: 'Distintos íconos',
      node: <>
        <IconButton aria-label="Buscar" variant="soft"><MagnifyingGlassIcon /></IconButton>
        <IconButton aria-label="Agregar" variant="solid"><PlusIcon /></IconButton>
        <IconButton aria-label="Eliminar" variant="outline"><TrashIcon /></IconButton>
        <IconButton aria-label="Ok" variant="soft"><CheckIcon /></IconButton>
      </>,
    },
    {
      title: 'Disabled',
      node: <IconButton aria-label="Disabled" variant="soft" disabled><HeartIcon /></IconButton>,
    },
  ],
}

const entries: DocEntry[] = [button, iconButton]
export default entries
