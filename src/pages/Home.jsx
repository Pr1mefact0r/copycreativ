import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'

export default function Home() {
  useEffect(() => {
    const hero = document.querySelector('.hero')
    const content = document.querySelector('.hero-content')
    if (!hero || !content) return

    const onScroll = () => {
      const y = window.scrollY
      if (y > hero.offsetHeight) return
      const ratio = y / hero.offsetHeight
      content.style.transform = `translateY(${y * 0.3}px)`
      content.style.opacity = 1 - ratio * 1.5
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="https://videos.pexels.com/video-files/3936483/3936483-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-shapes">
          <div className="hero-shape hero-shape-1" />
          <div className="hero-shape hero-shape-2" />
          <div className="hero-shape hero-shape-3" />
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow"><span className="pulse-dot" /> Digital und innovativ</div>
          <h1 className="hero-title">Gallo Copy<br /><span className="gradient-text">Creativ</span></h1>
          <p className="hero-subtitle">Geschäftsdrucksachen, Broschüren, Couverts oder Flyer: Guter Ausdruck macht Eindruck. Individuell konzipiert, termingerecht ausgeführt.</p>
          <div className="hero-buttons">
            <Link to="/dienstleistungen" className="btn btn-primary">Unsere Leistungen →</Link>
            <Link to="/kontakt" className="btn btn-outline">Kontakt aufnehmen</Link>
          </div>
        </div>
        <div className="scroll-hint"><span>Scroll</span><div className="scroll-line" /></div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="trust-grid">
          {[
            { icon: '🎨', title: 'Kreatives Design', desc: 'Individuell & massgeschneidert' },
            { icon: '🖨️', title: 'Profidruck', desc: 'Verblüffende Qualität' },
            { icon: '⏱️', title: 'Termingerecht', desc: 'Pünktlich & zuverlässig' },
            { icon: '💰', title: 'Faire Preise', desc: 'Bestes Preis-Leistungs-Verhältnis' },
          ].map((f, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="trust-item">
                <div className="trust-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Services Preview */}
      <section className="section section-light" id="leistungen">
        <div className="container">
          <ScrollReveal>
            <div className="section-header text-center">
              <span className="section-label">Was wir bieten</span>
              <h2 className="section-title">Unsere Dienstleistungen</h2>
              <p className="section-subtitle mx-auto">Von der Idee zum fertigen Produkt – alles aus einer Hand.</p>
            </div>
          </ScrollReveal>
          <div className="services-grid">
            {[
              { icon: '📄', title: 'Geschäftsdrucksachen', desc: 'Visitenkarten, Briefpapier, Couverts und alles was Ihr Unternehmen professionell repräsentiert.' },
              { icon: '📖', title: 'Broschüren & Flyer', desc: 'Hochwertige Broschüren und Flyer für Ihre Werbung – von der Gestaltung bis zum fertigen Druck.' },
              { icon: '🎨', title: 'Grafikdesign', desc: 'Logos, Corporate Design und visuelle Konzepte, die Ihre Marke unverwechselbar machen.' },
              { icon: '🖥️', title: 'Digitale Lösungen', desc: 'Moderne digitale Drucklösungen und Datenaufbereitung für optimale Ergebnisse.' },
              { icon: '📦', title: 'Grossformatdruck', desc: 'Banner, Plakate und Displays in beeindruckender Grösse und Qualität.' },
              { icon: '✂️', title: 'Veredelung', desc: 'Folienprägung, Stanzung, Laminierung und weitere Veredelungstechniken für den besonderen Touch.' },
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="service-card">
                  <div className="service-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="text-center" style={{ marginTop: '3rem' }}>
              <Link to="/dienstleistungen" className="btn btn-primary">Alle Leistungen ansehen →</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* About Preview */}
      <section className="section section-dark">
        <div className="container">
          <div className="about-preview-grid">
            <ScrollReveal>
              <div className="about-preview-image">
                <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80" alt="Team bei der Arbeit" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="about-preview-text">
                <span className="section-label">Über uns</span>
                <h2>Unser Team</h2>
                <p>Wir sind mehr als nur ein Haufen Experten: Bei uns arbeiten kluge Köpfe als Freunde zusammen. Gemeinsam stecken wir viel Freude und Leidenschaft in unser Produkt, das zeichnet uns aus.</p>
                <p>Unsere Arbeit ist unsere Leidenschaft und ein positiver Antrieb für jeden neuen Tag. Sie bringt uns dazu, Herausforderungen als Chance zu verstehen und neue Ziele zu erreichen.</p>
                <Link to="/ueber-uns" className="btn btn-outline">Mehr erfahren →</Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <ScrollReveal>
          <div className="cta-inner">
            <span className="section-label">Kontakt</span>
            <h2>Auf gute Zusammenarbeit</h2>
            <p>Wir freuen uns von Ihnen zu hören! Melden Sie sich bei uns und wir finden gemeinsam heraus, was wir für Sie tun und wie wir Ihnen helfen können.</p>
            <div className="cta-buttons">
              <Link to="/kontakt" className="btn btn-primary">Jetzt anfragen →</Link>
              <a href="tel:+41719231234" className="btn btn-outline">Anrufen</a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
