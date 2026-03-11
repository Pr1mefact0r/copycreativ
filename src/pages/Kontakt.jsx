import { useState } from 'react'
import ScrollReveal from '../components/ScrollReveal'

export default function Kontakt() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', betreff: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', phone: '', betreff: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-label">Kontakt</span>
          <h1 className="page-hero-title">Wir freuen uns<br />von Ihnen zu hören</h1>
          <p className="page-hero-subtitle">Melden Sie sich bei uns und wir finden gemeinsam heraus, was wir für Sie tun können.</p>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <div className="contact-grid">
            <ScrollReveal>
              <div className="contact-info-side">
                <h2>Kontaktdaten</h2>
                <div className="contact-cards">
                  {[
                    { icon: '📍', title: 'Adresse', text: 'Gallo Copy Creativ\n9243 Jonschwil' },
                    { icon: '📞', title: 'Telefon', text: '+41 71 923 12 34', link: 'tel:+41719231234' },
                    { icon: '📧', title: 'E-Mail', text: 'info@gallocopycreativ.ch', link: 'mailto:info@gallocopycreativ.ch' },
                    { icon: '🕐', title: 'Öffnungszeiten', text: 'Mo-Fr: 08:00-12:00\n13:30-17:30' },
                  ].map((c, i) => (
                    <div className="contact-card" key={i}>
                      <div className="contact-card-icon">{c.icon}</div>
                      <h3>{c.title}</h3>
                      {c.link ? (
                        <a href={c.link}>{c.text}</a>
                      ) : (
                        <p style={{ whiteSpace: 'pre-line' }}>{c.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="contact-form-wrapper">
                <h2>Nachricht senden</h2>
                {sent && <div className="form-success">Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns in Kürze bei Ihnen.</div>}
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name *</label>
                      <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ihr Name" />
                    </div>
                    <div className="form-group">
                      <label>E-Mail *</label>
                      <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="ihre@email.ch" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Telefon</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+41 71 ..." />
                    </div>
                    <div className="form-group">
                      <label>Betreff *</label>
                      <input type="text" required value={form.betreff} onChange={e => setForm({...form, betreff: e.target.value})} placeholder="Worum geht es?" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Nachricht *</label>
                    <textarea rows="6" required value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Ihre Nachricht an uns..." />
                  </div>
                  <button type="submit" className="btn btn-primary">Nachricht senden →</button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}
