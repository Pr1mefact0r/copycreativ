import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Kontakt from './pages/Kontakt'
import Dienstleistungen from './pages/Dienstleistungen'
import UeberUns from './pages/UeberUns'
import Aktuelles from './pages/Aktuelles'
import Konfigurator from './pages/Konfigurator'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/dienstleistungen" element={<Dienstleistungen />} />
          <Route path="/ueber-uns" element={<UeberUns />} />
          <Route path="/aktuelles" element={<Aktuelles />} />
          <Route path="/konfigurator" element={<Konfigurator />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  )
}

export default App
