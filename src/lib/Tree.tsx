import { useState } from 'react'
import type { ReactNode } from 'react'

export interface TreeNode {
  key: string
  label: string
  icon?: ReactNode
  children?: TreeNode[]
}

interface TreeProps {
  nodes?: TreeNode[]
  active?: string
  defaultExpanded?: string[]
  onSelect?: (key: string) => void
}

function ChevronRight({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"
      style={{ flex: '0 0 auto', transition: 'transform .18s ease', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

interface NodeRowProps {
  node: TreeNode
  depth: number
  active?: string
  expanded: string[]
  onToggle: (key: string) => void
  onSelect?: (key: string) => void
}

function NodeRow({ node, depth, active, expanded, onToggle, onSelect }: NodeRowProps) {
  const hasKids = !!node.children?.length
  const isActive = node.key === active
  const isOpen = expanded.includes(node.key)

  function handleClick() {
    if (hasKids) {
      onToggle(node.key)
    } else {
      onSelect?.(node.key)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        aria-current={isActive ? 'true' : undefined}
        aria-expanded={hasKids ? isOpen : undefined}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
          paddingTop: '8px', paddingBottom: '8px',
          paddingLeft: (12 + depth * 18) + 'px', paddingRight: '12px',
          borderRadius: '9px', border: 'none', cursor: 'pointer', textAlign: 'left',
          background: isActive ? 'color-mix(in srgb, var(--primary,#C9A24B) 14%, transparent)' : 'transparent',
          color: isActive ? 'var(--primary,#C9A24B)' : 'var(--muted-foreground,#9AA6B2)',
          fontFamily: 'Archivo', fontWeight: isActive ? 700 : 500, fontSize: '14px',
          transition: 'background .14s ease, color .14s ease',
          position: 'relative',
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--muted,#1F2530)' }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
      >
        {isActive && (
          <span style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            width: '3px', height: '16px', borderRadius: '0 3px 3px 0',
            background: 'var(--primary,#C9A24B)',
          }} />
        )}
        {hasKids
          ? <ChevronRight open={isOpen} />
          : <span style={{ width: '14px', flex: '0 0 auto' }} />}
        {node.icon
          ? <span className="pq-ico" style={{ width: '16px', height: '16px', flex: '0 0 auto' }}>{node.icon}</span>
          : null}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.label}
        </span>
      </button>

      {hasKids && isOpen && (
        <div style={{ borderLeft: '1px solid var(--border,rgba(255,255,255,.08))', marginLeft: (12 + depth * 18 + 6) + 'px' }}>
          {node.children!.map((child) => (
            <NodeRow
              key={child.key}
              node={child}
              depth={depth + 1}
              active={active}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/** Árbol jerárquico con nodos expandibles, selección por clave activa e íconos opcionales. */
export default function Tree({ nodes = [], active, defaultExpanded = [], onSelect }: TreeProps) {
  const [expanded, setExpanded] = useState<string[]>(defaultExpanded)

  function toggle(key: string) {
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  return (
    <div style={{
      background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.1))',
      borderRadius: '14px', padding: '6px', overflow: 'hidden',
    }}>
      {nodes.map((node) => (
        <NodeRow
          key={node.key}
          node={node}
          depth={0}
          active={active}
          expanded={expanded}
          onToggle={toggle}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
