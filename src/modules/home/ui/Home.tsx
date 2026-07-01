import { css } from '@/shared/ui/css'
import { Btn, Badge, StatTile, Card, Banner } from '@/lib'
import EventCard from '@/shared/ui/components/EventCard'
import { useHomeVM } from './useHomeVM'

export default function Home() {
  const vals = useHomeVM()
  const ArrowRight = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(40px,7vw,90px) clamp(16px,4vw,40px) clamp(36px,5vw,64px)', borderBottom: '1px solid var(--border,rgba(255,255,255,.09))' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 82% -10%, color-mix(in srgb,var(--primary,#C9A24B) 22%, transparent), transparent 60%), radial-gradient(90% 80% at 0% 110%, color-mix(in srgb,var(--success,#34D17E) 13%, transparent), transparent 55%)' }} />
        <div style={{ position: 'relative', maxWidth: '1180px', margin: '0 auto' }}>
          {/* eyebrow pill → Badge with success dot */}
          <div style={{ marginBottom: '22px' }}>
            <Badge tone="neutral" dot>
              EL MERCADO DE PALCOS DEL FÚTBOL URUGUAYO
            </Badge>
          </div>

          <h1 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 900, fontStretch: '125%', letterSpacing: '-.04em', lineHeight: '.92', fontSize: 'clamp(40px,8vw,86px)', color: 'var(--foreground,#F4EFE6)', textWrap: 'balance' } as any}>
            El mejor lugar<br />del estadio,<br /><span style={{ color: 'var(--primary,#C9A24B)' }}>a tu nombre.</span>
          </h1>
          <p style={{ margin: '22px 0 0', maxWidth: '560px', fontSize: 'clamp(15px,2vw,19px)', lineHeight: 1.5, color: 'var(--muted-foreground,#9AA6B2)' }}>
            Reservá tu butaca en un palco para el evento que no te querés perder, con la comida y la bebida esperándote en tu lugar.
          </p>

          {/* PRIMARY CTAs */}
          <div style={{ marginTop: '34px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <Btn label="Ver próximos eventos" icon="calendar" size="lg" onClick={vals.goEvents} />
          </div>
          <p style={{ margin: '14px 0 0', fontFamily: "'Space Mono'", fontSize: '12px', color: 'var(--subtle-foreground,#6B7480)', maxWidth: '540px' }}>
            Elegí primero el evento y mirá qué palcos tienen asientos disponibles. Reservás tu butaca en minutos.
          </p>

          {/* hero stat mini-blocks → StatTile */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '28px' }}>
            {(vals.heroStats || []).map((s: any, i: number) => (
              <StatTile key={i} data={{ label: s.l, value: s.n }} />
            ))}
          </div>
        </div>
      </section>

      {/* PRÓXIMOS EVENTOS */}
      <section style={{ maxWidth: '1180px', margin: '0 auto', padding: 'clamp(36px,5vw,60px) clamp(16px,4vw,40px) clamp(20px,3vw,28px)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.14em', color: 'var(--primary,#C9A24B)', marginBottom: '8px' }}>PRÓXIMOS EVENTOS</div>
            <h2 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 800, fontStretch: '110%', letterSpacing: '-.03em', fontSize: 'clamp(26px,4vw,38px)', color: 'var(--foreground,#F4EFE6)' }}>Elegí tu evento</h2>
          </div>
          {/* "Ver todos" → Btn ghost with trailing arrow */}
          <Btn label="Ver todos" variant="ghost" trailingIcon={<ArrowRight />} onClick={vals.goEvents} />
        </div>

        <div style={css(vals.eventsGrid)}>
          {(vals.homeEvents || []).map((ev: any, i: number) => (
            <EventCard key={i} data={ev} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ borderTop: '1px solid var(--border,rgba(255,255,255,.09))', background: 'var(--card,#171B22)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: 'clamp(36px,5vw,60px) clamp(16px,4vw,40px)' }}>
          <h2 style={{ margin: '0 0 28px', fontFamily: "'Archivo'", fontWeight: 800, fontStretch: '110%', letterSpacing: '-.03em', fontSize: 'clamp(24px,3.5vw,34px)', color: 'var(--foreground,#F4EFE6)' }}>Cómo funciona</h2>

          {/* step cards → Card + Badge number */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px' }}>
            {(vals.steps || []).map((st: any, i: number) => (
              <Card key={i} padding="22px">
                <div style={{ marginBottom: '14px' }}>
                  <Badge tone="brand">{st.n}</Badge>
                </div>
                <h3 style={{ margin: '0 0 7px', fontFamily: "'Archivo'", fontWeight: 700, fontSize: '17px', color: 'var(--foreground,#F4EFE6)' }}>{st.t}</h3>
                <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.5, color: 'var(--muted-foreground,#9AA6B2)' }}>{st.d}</p>
              </Card>
            ))}
          </div>

          {/* owner CTA → Banner tone="brand" */}
          <div style={{ marginTop: '24px' }}>
            <Banner tone="brand" action={<Btn label="Publicar mi palco" onClick={vals.goPublish} />}>
              <div>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontStretch: '110%', fontSize: 'clamp(20px,3vw,28px)', letterSpacing: '-.02em', color: 'var(--foreground,#F4EFE6)', marginBottom: '4px' }}>¿Tenés un palco?</div>
                <div style={{ fontSize: '14.5px', lineHeight: 1.5, color: 'var(--muted-foreground,#9AA6B2)' }}>Publicalo gratis, marcá su ubicación en el estadio y alquilá sus asientos por evento.</div>
              </div>
            </Banner>
          </div>
        </div>
      </section>

      <footer style={{ maxWidth: '1180px', margin: '0 auto', padding: '30px clamp(16px,4vw,40px)', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', color: 'var(--subtle-foreground,#6B7480)', fontSize: '12.5px' }}>
        <span style={{ fontFamily: "'Space Mono'" }}>PALQUEATE · prototipo</span>
      </footer>
    </div>
  )
}
