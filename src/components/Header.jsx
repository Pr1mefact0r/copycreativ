import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }, [location])

  const toggleMenu = () => {
    setMenuOpen(o => !o)
    document.body.style.overflow = menuOpen ? '' : 'hidden'
  }

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  return (
    <header className={`header ${scrolled || !isHome ? 'scrolled' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="logo">
          Gallo<span>Copy</span>Creativ
        </Link>
        <button className="menu-toggle" aria-label="Menü" onClick={toggleMenu}>
          {menuOpen ? '✕' : '☰'}
        </button>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/dienstleistungen" className="nav-link" onClick={closeMenu}>Dienstleistungen</Link>
          <Link to="/ueber-uns" className="nav-link" onClick={closeMenu}>Über uns</Link>
          <Link to="/aktuelles" className="nav-link" onClick={closeMenu}>Aktuelles</Link>
          <Link to="/konfigurator" className="nav-cta" onClick={closeMenu}>Konfigurator</Link>
          <Link to="/kontakt" className="nav-cta nav-cta-outline" onClick={closeMenu}>Kontakt</Link>
        </nav>
      </div>
    </header>
  )
}
