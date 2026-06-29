// File → base64 data-URL helpers. Used by the publish wizard (palco photos)
// and the admin event modal (event image). Data URLs live in Zustand state
// only — this is an in-memory demo, so they are lost on reload.

/** Reads a single File into a base64 data URL. */
export function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/** Reads many Files into base64 data URLs, preserving input order. */
export function readImagesAsDataUrls(files: File[]): Promise<string[]> {
  return Promise.all(files.map(readImageAsDataUrl))
}

/** MIME type encoded in a data URL (e.g. 'image/png', 'application/pdf'). */
export function dataUrlMime(url: string): string {
  const m = /^data:([^;,]+)[;,]/.exec(url || '')
  return m ? m[1].toLowerCase() : ''
}

/** True when the data URL holds an image (so it can be shown/zoomed). */
export function isImageDataUrl(url: string): boolean {
  return dataUrlMime(url).indexOf('image/') === 0
}

/** File extension derived from the data URL's MIME (jpeg→jpg, fallback 'bin'). */
export function dataUrlExt(url: string): string {
  const mime = dataUrlMime(url)
  const sub = mime.split('/')[1] || ''
  return (sub.replace('jpeg', 'jpg').replace(/[^a-z0-9.+-]/g, '')) || 'bin'
}

/** Short human label for a non-image attachment (e.g. 'PDF', 'Archivo'). */
export function fileTypeLabel(url: string): string {
  const ext = dataUrlExt(url)
  return ext && ext !== 'bin' ? ext.toUpperCase() : 'Archivo'
}
