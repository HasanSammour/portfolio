import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LangContext'
import { FiMapPin, FiBookOpen, FiGlobe } from 'react-icons/fi'
import { stats, tickerLines } from '../data'
import Eyebrow from './Eyebrow'
import useTilt from '../hooks/useTilt'

function Count({ n, suffix, active }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf, t0
    const tick = (t) => {
      t0 ??= t
      const p = Math.min((t - t0) / 1600, 1)
      setV(Math.round(n * (1 - Math.pow(1 - p, 4))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, n])
  return <span className="num">{v}{suffix}</span>
}

function Ticker() {
  const [i, setI] = useState(0)
  useEffect(() => { const id = setInterval(() => setI((x) => x + 1), 1500); return () => clearInterval(id) }, [])
  const rows = [0, 1, 2, 3].map((k) => tickerLines[(i + k) % tickerLines.length])
  return (
    <div className="ticker" dir="ltr" aria-hidden>
      <div className="ticker-bar"><i /><i /><i /><span>live requests</span></div>
      <AnimatePresence initial={false} mode="popLayout">
        {rows.map((r, k) => {
          const [method, , status] = [r.split(/\s+/)[0], 0, r.trim().split(/\s+/).pop()]
          const path = r.slice(method.length, r.length - status.length)
          return (
            <motion.div key={(i + k) + r} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1 - k * 0.22, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4 }}>
              <b className={'m m-' + method.toLowerCase()}>{method}</b><span>{path.trim()}</span><em className={status.startsWith('2') ? 'ok' : ''}>{status}</em>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

function StatCard({ s, i }) {
  const { t } = useLang()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const tilt = useTilt(6)
  const Icon = s.icon
  const R = 26, C = 2 * Math.PI * R
  return (
    <motion.div ref={ref} className={'stat tilt' + (s.wide ? ' wide' : '')} {...tilt}
      initial={{ opacity: 0, y: 36, scale: 0.94 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ delay: i * 0.1, type: 'spring', stiffness: 110, damping: 16 }}>
      <div className="stat-top">
        <span className="stat-icon"><Icon /></span>
        <svg className="stat-ring" viewBox="0 0 64 64" aria-hidden>
          <circle cx="32" cy="32" r={R} className="r-bg" />
          <motion.circle cx="32" cy="32" r={R} className="r-fg" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={inView ? { strokeDashoffset: C * (1 - s.fill) } : {}} transition={{ delay: 0.3 + i * 0.1, duration: 1.6, ease: 'easeOut' }} />
        </svg>
      </div>
      <strong><Count n={s.n} suffix={s.suffix} active={inView} /></strong>
      <span className="stat-label">{t(s.label)}</span>
      {s.note && <span className="stat-note">{t(s.note)}</span>}
      {s.wide && <Ticker />}
    </motion.div>
  )
}

function Hl({ text, terms }) {
  const re = new RegExp('(' + terms.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g')
  return text.split(re).map((part, i) => (terms.includes(part) ? <mark key={i}>{part}</mark> : part))
}

export default function About() {
  const { u } = useLang()
  const icons = [FiMapPin, FiBookOpen, FiGlobe]
  const view = { once: true, margin: '-80px' }
  return (
    <section id="about" className="section">
      <div className="wrap">
        <div className="about">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.7 }}>
            <Eyebrow>{u.eyebrow.about}</Eyebrow>
            <h2 className="h2">{u.about.h2}</h2>
            <ul className="facts">
              {u.about.facts.map(([k, v], i) => {
                const Icon = icons[i]
                return (
                  <motion.li key={k} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 + i * 0.1 }}>
                    <span><Icon /></span><div><small>{k}</small><b>{v}</b></div>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>
          <motion.div className="about-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.7, delay: 0.12 }}>
            <p className="lead first"><Hl text={u.about.p1} terms={u.about.mark} /></p>
            <p className="lead"><Hl text={u.about.p2} terms={u.about.mark} /></p>
          </motion.div>
        </div>
        <div className="stats">{stats.map((s, i) => <StatCard key={s.id} s={s} i={i} />)}</div>
      </div>
    </section>
  )
}
