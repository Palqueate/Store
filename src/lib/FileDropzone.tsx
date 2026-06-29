import { useState } from 'react'

interface FileDropzoneProps {
  hint?: string
  accept?: string
  multiple?: boolean
  onFiles?: (files: File[]) => void
}

/** Dashed upload area with drag-over feedback. */
export default function FileDropzone({ hint = 'Arrastrá archivos o hacé clic para subir', accept, multiple = false, onFiles }: FileDropzoneProps) {
  const [over, setOver] = useState(false)

  function pick(list: FileList | null) {
    if (!list) return
    onFiles?.(Array.from(list))
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files) }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
        padding: '32px 24px', borderRadius: '14px', cursor: 'pointer', textAlign: 'center',
        background: over ? 'color-mix(in srgb, var(--primary,#C9A24B) 8%, var(--background,#0E1116))' : 'var(--background,#0E1116)',
        border: '1.5px dashed ' + (over ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.16))'),
        transition: 'background .15s ease, border-color .15s ease',
      }}
    >
      <span style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'grid', placeItems: 'center', background: 'var(--muted,#1F2530)', color: 'var(--primary,#C9A24B)' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
      </span>
      <span style={{ fontFamily: 'Archivo', fontWeight: 600, fontSize: '14px', color: 'var(--foreground,#F4EFE6)' }}>{hint}</span>
      <input type="file" accept={accept} multiple={multiple} onChange={(e) => pick(e.target.files)} style={{ display: 'none' }} />
    </label>
  )
}
