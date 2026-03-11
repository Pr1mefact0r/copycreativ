import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'

export default function UeberUns() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-label">Über uns</span>
          <h1 className="page-hero-title">Leidenschaft für<br />guten Ausdruck</h1>
          <p className="page-hero-subtitle">Lernen Sie das Team hinter Gallo Copy Creativ kennen.</p>
        </div>
      </section>

      {/* Story */}
      <section className="section section-light">
        <div className="container">
          <div className="about-grid">
            <ScrollReveal>
              <div className="about-image">
                <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80" alt="Unser Büro" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="about-text">
                <span className="section-label">Unsere Geschichte</span>
                <h2>Mehr als nur Druck</h2>
                <p>Unsere Arbeit ist unsere Leidenschaft und ein positiver Antrieb für jeden neuen Tag. Sie bringt uns dazu, Herausforderungen als Chance zu verstehen und neue Ziele zu erreichen.</p>
                <p>Wir sind mehr als nur ein Haufen Experten: Bei uns arbeiten kluge Köpfe als Freunde zusammen. Gemeinsam stecken wir viel Freude und Leidenschaft in unser Produkt, das zeichnet uns aus.</p>
                <p>Wir erstellen für Sie individuell konzipierte Drucksachen in verblüffender Qualität, termingerecht ausgeführt und mit einem überzeugenden Preis-Leistungsverhältnis.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section-dark">
        <div className="container">
          <ScrollReveal>
            <div className="section-header text-center">
              <span className="section-label">Werte</span>
              <h2 className="section-title">Wofür wir stehen</h2>
            </div>
          </ScrollReveal>
          <div className="values-grid">
            {[
              { icon: '🎯', title: 'Qualität', desc: 'Kompromisslose Qualität in jedem Detail – vom Papier bis zur Farbe.' },
              { icon: '🤝', title: 'Partnerschaft', desc: 'Wir arbeiten eng mit unseren Kunden zusammen und verstehen ihre Bedürfnisse.' },
              { icon: '💡', title: 'Innovation', desc: 'Modernste Technik und kreative Ideen für zukunftsweisende Lösungen.' },
              { icon: '⏱️', title: 'Zuverlässigkeit', desc: 'Termingerechte Lieferung und verbindliche Absprachen – darauf können Sie zählen.' },
              { icon: '🌱', title: 'Nachhaltigkeit', desc: 'Umweltbewusste Produktion mit zertifizierten Materialien und Prozessen.' },
              { icon: '❤️', title: 'Leidenschaft', desc: 'Jedes Projekt wird mit Herzblut und höchster Sorgfalt umgesetzt.' },
            ].map((v, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="value-card">
                  <div className="value-icon">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section-light">
        <div className="container">
          <ScrollReveal>
            <div className="section-header text-center">
              <span className="section-label">Team</span>
              <h2 className="section-title">Die Köpfe dahinter</h2>
              <p className="section-subtitle mx-auto">Ein eingespieltes Team mit Leidenschaft für guten Ausdruck.</p>
            </div>
          </ScrollReveal>
          <div className="team-grid">
            {[
              { name: 'Marco Gallo', role: 'Geschäftsführer', avatar: 'M' },
              { name: 'Sandra Meier', role: 'Grafikdesign', avatar: 'S' },
              { name: 'Thomas Keller', role: 'Druckproduktion', avatar: 'T' },
            ].map((m, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="team-card">
                  <div className="team-avatar">{m.avatar}</div>
                  <h3>{m.name}</h3>
                  <p className="team-role">{m.role}</p>
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
            <span className="section-label">Bereit?</span>
            <h2>Auf gute Zusammenarbeit</h2>
            <p>Wir freuen uns von Ihnen zu hören! Melden Sie sich bei uns und wir finden gemeinsam heraus, was wir für Sie tun können.</p>
            <Link to="/kontakt" className="btn btn-primary">Kontakt aufnehmen →</Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
