// ============================================================
// PALQUEATE · component library — public surface
// All primitives read the theme's short CSS vars (--primary, --card,
// --foreground, ...), so they react to the active theme automatically as
// long as they render inside a wrapper that carries those vars
// (the app's rootStyle does exactly this). Import lib.css once.
// ============================================================
import './lib.css'

// New library primitives
export { default as Badge } from './Badge'
export { default as Chip } from './Chip'
export { default as Card } from './Card'
export { default as Alert } from './Alert'
export { default as Avatar } from './Avatar'
export { default as Divider } from './Divider'
export { default as Spinner } from './Spinner'
export { default as Skeleton } from './Skeleton'
export { default as EmptyState } from './EmptyState'
export { default as Progress } from './Progress'
export { default as Tabs } from './Tabs'
export { default as Accordion } from './Accordion'
export { default as Modal } from './Modal'
export { default as Tooltip } from './Tooltip'
export { default as Breadcrumb } from './Breadcrumb'
export { default as Pagination } from './Pagination'
export { default as Select } from './Select'
export { default as Textarea } from './Textarea'
export { default as Checkbox } from './Checkbox'
export { default as RadioGroup } from './Radio'
export { default as RadioCardGroup } from './RadioCardGroup'

// Layout & typography primitives
export { default as Stack } from './Stack'
export { default as Kbd } from './Kbd'
export { default as Topbar } from './Topbar'
export { default as NavSidebar } from './NavSidebar'
export { default as Sidebar } from './Sidebar'
export type { NavItem, NavGroup } from './Sidebar'

// Actions & display
export { default as IconButton } from './IconButton'
export { default as Tag } from './Tag'
export { default as Banner } from './Banner'
export { default as StatusDot } from './StatusDot'
export { default as AvatarGroup } from './AvatarGroup'
export { default as DescriptionList } from './DescriptionList'
export { default as Timeline } from './Timeline'
export { default as Collapsible } from './Collapsible'
export { default as Rating } from './Rating'
export { default as ProgressRing } from './ProgressRing'
export { default as Stepper } from './Stepper'
export { default as Table } from './Table'

// Inputs & controls
export { default as SegmentedControl } from './SegmentedControl'
export { default as QuantityStepper } from './QuantityStepper'
export { default as SearchInput } from './SearchInput'
export { default as Slider } from './Slider'
export { default as RangeSlider } from './RangeSlider'
export { default as FileDropzone } from './FileDropzone'

// Overlays
export { default as Drawer } from './Drawer'
export { default as Menu } from './Menu'
export { default as Popover } from './Popover'
export { ToastProvider, useToast } from './Toast'

// Floating primitive (portal-based positioning for all popovers)
export { default as FloatingPanel } from './Floating'
export type { Placement } from './Floating'

// Overlays & menus (wave 1)
export { default as Dropdown } from './Dropdown'
export { default as ContextMenu } from './ContextMenu'
export { default as UserMenu } from './UserMenu'
export { default as CommandPalette } from './CommandPalette'
export { default as Notifications } from './Notifications'
export { default as Fab } from './Fab'

// Form inputs (wave 2)
export { default as NumberInput } from './NumberInput'
export { default as PinInput } from './PinInput'
export { default as Combobox } from './Combobox'
export { default as MultiSelect } from './MultiSelect'
export { default as ColorPicker } from './ColorPicker'
export { default as Editable } from './Editable'
export { default as CopyButton } from './CopyButton'

// Dates (wave 3)
export { default as Calendar } from './Calendar'
export { default as DatePicker } from './DatePicker'
export { default as DateRange } from './DateRange'

// Data display (wave 4)
export { default as Tree } from './Tree'
export { default as VirtualList } from './VirtualList'
export { default as Sparkline } from './Sparkline'
export { default as Statistic } from './Statistic'
export { default as Result } from './Result'
export { default as Code } from './Code'

// Layout & nav (wave 5)
export { default as Carousel } from './Carousel'
export { default as Splitter } from './Splitter'
export { default as NavMenu } from './NavMenu'

// Re-exported app primitives so the library is the single import surface
export { default as Btn } from '@/shared/ui/components/Btn'
export { default as Field } from '@/shared/ui/components/Field'
export { default as Toggle } from '@/shared/ui/components/Toggle'
export { default as StatTile } from '@/shared/ui/components/StatTile'
