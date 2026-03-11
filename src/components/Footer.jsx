import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">Gallo<span>Copy</span></div>
            <p>Gallo Copy Creativ – Ihr Partner für professionelle Drucksachen, kreatives Design und digitale Lösungen in Jonschwil und Umgebung.</p>
          </div>
          <div>
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dienstleistungen">Dienstleistungen</Link></li>
              <li><Link to="/ueber-uns">Über uns</Link></li>
              <li><Link to="/aktuelles">Aktuelles</Link></li>
              <li><Link to="/kontakt">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li>Gallo Copy Creativ</li>
              <li>9243 Jonschwil</li>
              <li className="footer-contact-link"><a href="tel:+41719231234">+41 71 923 12 34</a></li>
              <li className="footer-contact-link"><a href="mailto:info@gallocopycreativ.ch">info@gallocopycreativ.ch</a></li>
            </ul>
          </div>
          <div>
            <h4>Rechtliches</h4>
            <ul>
              <li><a href="#">Impressum</a></li>
              <li><a href="#">Datenschutz</a></li>
              <li><a href="#">Cookie-Einstellungen</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Gallo Copy Creativ. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
