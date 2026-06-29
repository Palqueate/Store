# Palqueate — app

A faithful React + TypeScript (Vite) implementation of the **Palqueate** prototype
that was designed in Claude Design (see `../project/Palqueate.dc.html`). Palqueate is a
two‑sided marketplace for renting *palcos* (private boxes) at Uruguayan football
stadiums: fans browse **events**, see which palcos have seats free, and book a whole
box for the year, a seat for the season, or a single seat for one event. Box owners
(*palquistas*) publish/manage palcos and see stats; a system **admin** loads events,
manages stadiums, and runs the CRM + finance dashboard.

The prototype was built with Claude Design's "Design Components" runtime (`support.js`);
that runtime is **not** reproduced here — instead the design (template + logic) was
ported to real React.

## Run it

```bash
cd app
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check (tsc --noEmit) + production build to dist/
npm run preview    # serve the production build
npm run typecheck  # type-check only
```

> Fonts (Archivo + Space Mono) load from the Google Fonts CDN, exactly as in the
> source design. Everything else (state, payments, data) is client-side and simulated;
> accounts/orders persist to `localStorage`.

## Try the flows

- **Client (event‑first):** Home → *Ver próximos eventos* → pick an event → choose a
  palco with availability → pick seats → cart → checkout → pay → confirmation (code +
  QR) → botana & bebidas menu → "pedido listo".
- **By season:** *Alquilar por temporada* → palco detail with the three modalities
  (palco entero / asiento anual / asiento por evento) and the interactive stadium map.
- **Owner (*Soy dueño*):** *Mis palcos* (pause/resume) + *Estadísticas*, and the 5‑step
  **Publicar palco** wizard (stadium → place pin on the map → seats → parking → prices).
- **Auth:** *Ingresar* logs straight into the demo account **María Eugenia** (as in the
  prototype). Avatar menu → *Mi cuenta* (profile, photo, preferences, purchase history).
- **Admin** (María Eugenia is an admin): avatar → *Administración* → Dashboard, Eventos
  (+ new event), Estadios (+ add stadium), Palcos, Clientes, Reservas, Finanzas. Events
  and stadiums created here appear immediately on the client side.
- **Themes:** the header toggle switches *Palco · noche* (dark) ↔ *Cancha · día* (light).
- **Responsive:** below 860px the top nav collapses to a fixed bottom tab bar.

## Architecture

```
src/
  data.ts            Domain data + types (stadiums, events, palcos, food, seed user/orders, themes)
  store.ts           PalqueateStore — the prototype's logic class ported 1:1
                       (state + actions + computeVals()), wired to React via
                       useSyncExternalStore. useVals()/useStore() hooks.
  util.ts            css() — parses the prototype's inline-style strings into React
                       style objects (lets the markup stay faithful); cx().
  App.tsx            Root: applies the theme vars, header, screen switch, overlays.
  components/        The 8 reusable primitives extracted in the design system —
                       Btn, Field, Toggle, StatTile, SeatGrid, StadiumMap,
                       EventCard, PalcoCard — plus Header and Overlays
                       (bottom nav, auth modal, admin modals, toast).
  screens/           One component per screen, each consuming the computed `vals`.
  styles/            styles.css → design-system tokens (tokens/*.css) + global.css.
```

The single source of truth for state is `PalqueateStore.computeVals()`, a near‑verbatim
port of the prototype's `renderVals()`. Every screen reads from that view‑model, so the
behavior matches the original design exactly.
