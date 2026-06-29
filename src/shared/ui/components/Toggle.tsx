interface ToggleProps {
  on?: boolean
  onToggle?: () => void
}

export default function Toggle({ on = false, onToggle }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="Activar/desactivar"
      style={{ width: '46px', height: '27px', borderRadius: '20px', border: 'none', cursor: 'pointer', position: 'relative', flex: '0 0 auto', background: on ? 'var(--primary,#C9A24B)' : 'var(--muted,#1F2530)', boxShadow: 'inset 0 0 0 1px ' + (on ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.12))') }}
    >
      <span style={{ display: 'block', position: 'absolute', top: '3px', left: '3px', width: '21px', height: '21px', borderRadius: '50%', background: on ? 'var(--primary-foreground,#1A1407)' : 'var(--subtle-foreground,#6B7480)', transform: 'translateX(' + (on ? '19px' : '0px') + ')', transition: 'transform .15s ease' }} />
    </button>
  )
}
