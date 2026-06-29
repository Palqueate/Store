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
