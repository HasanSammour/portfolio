import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGlobe } from 'react-icons/fi'
import { useLang } from '../context/LangContext'
import useActiveSection from '../hooks/useActiveSection'

const ids = ['top', 'about', 'skills', 'journey', 'projects', 'certificates', 'contact']
const keys = ids.slice(1)

export default function Navbar() {
  const { u, toggle } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(ids)
  useEffect(() => {
    const on = () => setScrolled(scrollY > 40)
    on(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  return (
    <motion.header className={scrolled ? 'nav scrolled' : 'nav'} initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 2.3, type: 'spring', stiffness: 90, damping: 16 }}>
      <a href="#top" className="nav-logo" aria-label="Hasan Sammour">
        <img src="/logo.png" srcSet="/logo.png 1x, /logo@2x.png 2x" alt="" width="34" height="40" />
        <span>Hasan</span>
      </a>
      <nav className="nav-links" aria-label="Sections">
        {keys.map((k) => (
          <a key={k} href={'#' + k} className={active === k ? 'on' : ''}>
            {active === k && <motion.span layoutId="navpill" className="nav-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{u.nav[k]}</span>
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        <button className="lang-btn" onClick={toggle} aria-label={u.langLabel}><FiGlobe /> {u.langBtn}</button>
        <button className={open ? 'nav-burger open' : 'nav-burger'} onClick={() => setOpen(!open)} aria-label={u.menu} aria-expanded={open}><span /><span /></button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="nav-sheet" initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.97 }}>
            {keys.map((k) => <a key={k} href={'#' + k} onClick={() => setOpen(false)} className={active === k ? 'on' : ''}>{u.nav[k]}</a>)}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
