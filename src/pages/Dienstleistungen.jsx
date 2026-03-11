import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'

const SERVICES = [
  {
    icon: '📄',
    title: 'Geschäftsdrucksachen',
    desc: 'Visitenkarten, Briefpapier, Couverts, Rechnungsformulare und alles was Ihr Unternehmen professionell repräsentiert. Hochwertige Materialien und präziser Druck für den perfekten ersten Eindruck.',
    features: ['Visitenkarten', 'Briefpapier & Couverts', 'Rechnungsformulare', 'Stempel & Schilder'],
  },
  {
    icon: '📖',
    title: 'Broschüren & Flyer',
    desc: 'Von der klassischen Imagebroschüre bis zum kompakten Flyer – wir gestalten und drucken Ihre Werbemittel mit Liebe zum Detail und in verblüffender Qualität.',
    features: ['Imagebroschüren', 'Produktflyer', 'Faltblätter', 'Kataloge'],
  },
  {
    icon: '🎨',
    title: 'Grafikdesign',
    desc: 'Professionelle Gestaltung von Logos, Corporate Design und visuellen Konzepten. Wir entwickeln eine Bildsprache, die Ihre Marke unverwechselbar macht.',
    features: ['Logo-Design', 'Corporate Identity', 'Bildbearbeitung', 'Layoutgestaltung'],
  },
  {
    icon: '🖥️',
    title: 'Digitaldruck',
    desc: 'Modernste Digitaldrucktechnologie für flexible Auflagen und schnelle Lieferzeiten. Ideal für personalisierte Drucksachen und Kleinauflagen.',
    features: ['Kleinstauflagen', 'Personalisierung', 'Schnelle Lieferung', 'Variable Daten'],
  },
  {
    icon: '📦',
    title: 'Grossformatdruck',
    desc: 'Banner, Roll-Ups, Plakate und Displays in beeindruckender Grösse. Perfekt für Messen, Events und Werbung am Point of Sale.',
    features: ['Banner & Plakate', 'Roll-Up Displays', 'Messewände', 'Schaufensterbeschriftung'],
  },
  {
    icon: '✂️',
    title: 'Veredelung & Finishing',
    desc: 'Folienprägung, Stanzung, Laminierung, Rillung und weitere Veredelungstechniken verleihen Ihren Drucksachen den besonderen Touch.',
    features: ['Folienprägung', 'Laminierung', 'Stanzung & Rillung', 'Cellophanierung'],
  },
]

export default function Dienstleistungen() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-label">Leistungen</span>
          <h1 className="page-hero-title">Unsere Dienstleistungen</h1>
          <p className="page-hero-subtitle">Von der Idee zum fertigen Produkt – alles aus einer Hand, termingerecht und in höchster Qualität.</p>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <div className="services-detail-grid">
            {SERVICES.map((s, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="service-detail-card">
                  <div className="service-detail-icon">{s.icon}</div>
                  <div className="service-detail-content">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <ul className="service-features">
                      {s.features.map(f => (
                        <li key={f}><span className="check">✓</span> {f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section section-dark">
        <div className="container">
          <ScrollReveal>
            <div className="section-header text-center">
              <span className="section-label">Ablauf</span>
              <h2 className="section-title">So arbeiten wir</h2>
              <p className="section-subtitle mx-auto">In vier einfachen Schritten zu Ihrem perfekten Druckprodukt.</p>
            </div>
          </ScrollReveal>
          <div className="process-grid">
            {[
              { num: '01', title: 'Beratung', desc: 'Wir besprechen Ihre Wünsche und beraten Sie zu Material, Format und Gestaltung.' },
              { num: '02', title: 'Konzept', desc: 'Unser Design-Team entwickelt ein massgeschneidertes Konzept für Ihr Projekt.' },
              { num: '03', title: 'Produktion', desc: 'Nach Ihrer Freigabe produzieren wir termingerecht und in höchster Qualität.' },
              { num: '04', title: 'Lieferung', desc: 'Ihre fertigen Drucksachen werden sorgfältig verpackt und pünktlich geliefert.' },
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="process-step">
                  <div className="process-num">{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <ScrollReveal>
          <div className="cta-inner">
            <span className="section-label">Projekt starten</span>
            <h2>Haben Sie ein Projekt?</h2>
            <p>Kontaktieren Sie uns für eine unverbindliche Offerte. Wir beraten Sie gerne persönlich.</p>
            <Link to="/kontakt" className="btn btn-primary">Jetzt anfragen →</Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
