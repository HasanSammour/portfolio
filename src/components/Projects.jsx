import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiExternalLink, FiGithub } from 'react-icons/fi'
import { useLang } from '../context/LangContext'
import { projects } from '../data'
import useTilt from '../hooks/useTilt'
import Tabs from './Tabs'
import Eyebrow from './Eyebrow'

const cardV = { hidden: { opacity: 0, y: 40, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 110, damping: 16 } } }

function Card({ p }) {
  const { t, u, sign } = useLang()
  const tilt = useTilt(6)
  const host = (p.demo || p.github).replace(/^https?:\/\//, '').replace(/\/$/, '')
  return (
    <motion.article className="proj tilt" variants={cardV} style={{ '--accent': p.color, ...tilt.style }} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>
      <div className="win" aria-hidden>
        <div className="win-bar"><i /><i /><i /><span dir="ltr">{host}</span></div>
        <div className="win-body">
          <b className="sk a" /><b className="sk b" /><b className="sk c" /><b className="sk d" />
          <div className="metrics">{p.metrics.map((m) => <span key={typeof m === 'string' ? m : m.en}>{t(m)}</span>)}</div>
        </div>
      </div>
      <div className="proj-main">
        <span className="proj-type">{t(p.type)}</span>
        <h3>{t(p.title)}</h3>
        <p className="proj-role">{t(p.role)}</p>
        <p>{t(p.blurb)}</p>
        <motion.ul initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}>
          {p.points.map((x, i) => <motion.li key={i} variants={{ hidden: { opacity: 0, x: -14 * sign }, show: { opacity: 1, x: 0 } }}>{t(x)}</motion.li>)}
        </motion.ul>
        <div className="chips small">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
        <div className="proj-links">
          {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" className="btn btn-main"><FiExternalLink /> {u.projects.live}</a>}
          {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="btn btn-ghost"><FiGithub /> {u.projects.code}</a>}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const { u } = useLang()
  const [f, setF] = useState('all')
  const list = projects.filter((p) => f === 'all' || p.cats.includes(f))
  const items = Object.entries(u.projects.f).map(([id, label]) => ({ id, label, count: projects.filter((p) => id === 'all' || p.cats.includes(id)).length }))
  return (
    <section id="projects" className="section">
      <div className="wrap">
        <div className="head-center">
          <Eyebrow>{u.eyebrow.projects}</Eyebrow>
          <h2 className="h2">{u.projects.h2}</h2>
          <p className="lead narrow">{u.projects.lead}</p>
          <Tabs id="projects" items={items} value={f} onChange={setF} className="center" />
        </div>
        {/* key remounts the grid so cards re-enter with a stagger instead of shuffling */}
        <motion.div key={f} className="proj-grid" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.09 } } }}>
          {list.map((p) => <Card key={p.id} p={p} />)}
        </motion.div>
      </div>
    </section>
  )
}
