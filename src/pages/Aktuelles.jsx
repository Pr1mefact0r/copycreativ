import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'

const NEWS = [
  {
    date: '10. März 2026',
    title: 'Neue Digitaldruckmaschine im Einsatz',
    excerpt: 'Mit unserer neuen Digitaldruckmaschine bieten wir noch schnellere Lieferzeiten und noch bessere Druckqualität für Kleinauflagen und personalisierte Drucksachen.',
    image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&q=80',
  },
  {
    date: '15. Februar 2026',
    title: 'Nachhaltigkeit im Fokus',
    excerpt: 'Wir setzen verstärkt auf umweltfreundliche Materialien und Prozesse. Ab sofort bieten wir FSC-zertifiziertes Papier als Standard für alle Druckaufträge.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
  },
  {
    date: '20. Januar 2026',
    title: 'Frohes neues Jahr 2026',
    excerpt: 'Wir starten mit voller Energie ins neue Jahr und freuen uns auf spannende Projekte. Danke für Ihr Vertrauen im vergangenen Jahr!',
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&q=80',
  },
  {
    date: '5. Dezember 2025',
    title: 'Weihnachtskarten-Aktion',
    excerpt: 'Bestellen Sie jetzt Ihre individuellen Weihnachtskarten! Profitieren Sie von unserem Spezialangebot für Firmen mit persönlicher Gestaltung.',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&q=80',
  },
]

export default function Aktuelles() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-label">News</span>
          <h1 className="page-hero-title">Aktuelles</h1>
          <p className="page-hero-subtitle">Neuigkeiten und Updates aus der Welt von Gallo Copy Creativ.</p>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <div className="news-grid">
            {NEWS.map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <article className="news-card">
                  <div className="news-image">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>
                  <div className="news-content">
                    <span className="news-date">{item.date}</span>
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <ScrollReveal>
          <div className="cta-inner">
            <span className="section-label">Immer informiert</span>
            <h2>Bleiben Sie auf dem Laufenden</h2>
            <p>Haben Sie Fragen zu unseren aktuellen Angeboten? Kontaktieren Sie uns – wir beraten Sie gerne.</p>
            <Link to="/kontakt" className="btn btn-primary">Kontakt →</Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
