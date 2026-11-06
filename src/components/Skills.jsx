import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'
import { skillGroups } from '../data'
import useTilt from '../hooks/useTilt'
import Eyebrow from './Eyebrow'

function Group({ g, i }) {
  const { t } = useLang()
  const tilt = useTilt(4)
  const Icon = g.icon
  return (
    <motion.article className={'skill tilt span-' + g.span} style={{ '--accent': g.color, ...tilt.style }} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.08, duration: 0.6 }}>
      <header>
        <span className="skill-icon"><Icon /></span>
        <h3>{t(g.title)}</h3>
        <span className="skill-count">{g.items.length}</span>
      </header>
      <motion.div className="chips" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.25 + i * 0.08 } } }}>
        {g.items.map((it) => (
          <motion.span key={typeof it === 'string' ? it : it.en} variants={{ hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1 } }}>{t(it)}</motion.span>
        ))}
      </motion.div>
    </motion.article>
  )
}

export default function Skills() {
  const { u } = useLang()
  return (
    <section id="skills" className="section tight">
      <div className="wrap">
        <div className="head-center">
          <Eyebrow>{u.eyebrow.skills}</Eyebrow>
          <h2 className="h2">{u.skills.h2}</h2>
          <p className="lead narrow">{u.skills.lead}</p>
        </div>
        <div className="bento">{skillGroups.map((g, i) => <Group key={g.id} g={g} i={i} />)}</div>
      </div>
    </section>
  )
}
