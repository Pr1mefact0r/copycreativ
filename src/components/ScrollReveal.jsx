import { useEffect, useRef } from 'react'

export default function ScrollReveal({ children, delay = 0 }) {
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.transitionDelay = `${delay}ms`
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('visible')
        observer.unobserve(el)
      }
    }, { threshold: 0.15 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return <div className="reveal" ref={ref}>{children}</div>
}
