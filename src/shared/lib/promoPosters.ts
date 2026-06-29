// Carátulas promocionales (data-URL SVG) para los eventos sembrados del demo.
//
// En producción la imagen promo de un evento la sube el administrador (queda en
// `Ev.images`). Para que el banner destacado de la tarjeta se vea sin depender
// de assets externos, acá generamos pósters SVG livianos: degradado de marca +
// un halo + formas + un monograma del evento de fondo. NO llevan el nombre
// legible del evento horneado: ese texto lo pone la tarjeta encima del banner,
// igual que haría sobre una foto real. Son data-URLs, así que viajan inline en
// el estado y no requieren red.

export interface PosterOpts {
  /** Nombre del evento. Solo se usa para derivar el monograma de fondo. */
  title: string
  /** Color inicial del degradado de fondo. */
  from: string
  /** Color final del degradado de fondo. */
  to: string
  /** Color del halo/acento. Por defecto, el dorado de marca. */
  accent?: string
}

/** Escapa los caracteres que romperían el XML del SVG. */
function xml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Monograma de 1–2 letras a partir del nombre (p. ej. "Banda Aurora" → "BA"). */
function monogram(name: string): string {
  const words = String(name).trim().split(/\s+/).filter(Boolean)
  const letters = words.length >= 2 ? words[0][0] + words[1][0] : (words[0] || '?').slice(0, 2)
  return xml(letters.toUpperCase())
}

/** Devuelve un póster promocional abstracto como data-URL SVG (ratio 16:9). */
export function promoPoster(o: PosterOpts): string {
  const accent = o.accent || '#C9A24B'
  const mono = monogram(o.title)
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'>" +
    "<defs>" +
    "<linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
    "<stop offset='0' stop-color='" + o.from + "'/>" +
    "<stop offset='1' stop-color='" + o.to + "'/>" +
    "</linearGradient>" +
    "<radialGradient id='h' cx='0.8' cy='0.25' r='0.9'>" +
    "<stop offset='0' stop-color='" + accent + "' stop-opacity='0.55'/>" +
    "<stop offset='1' stop-color='" + accent + "' stop-opacity='0'/>" +
    "</radialGradient>" +
    "</defs>" +
    "<rect width='640' height='360' fill='url(#g)'/>" +
    "<rect width='640' height='360' fill='url(#h)'/>" +
    // Líneas diagonales sutiles que dan textura de cancha/escenario.
    "<g stroke='#ffffff' stroke-opacity='0.06' stroke-width='2'>" +
    "<path d='M-40 300 L320 -60'/><path d='M40 360 L420 -40'/><path d='M140 380 L520 -20'/>" +
    "</g>" +
    "<circle cx='520' cy='95' r='150' fill='none' stroke='" + accent + "' stroke-opacity='0.16' stroke-width='2'/>" +
    "<circle cx='520' cy='95' r='98' fill='none' stroke='" + accent + "' stroke-opacity='0.1' stroke-width='2'/>" +
    // Monograma grande y translúcido como elemento gráfico (no texto legible del evento).
    "<text x='500' y='150' text-anchor='middle' fill='#ffffff' fill-opacity='0.1' font-family='Archivo, Arial, sans-serif' font-weight='800' font-size='190' letter-spacing='-6'>" + mono + "</text>" +
    "</svg>"
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}
