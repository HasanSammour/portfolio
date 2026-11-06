import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useInView } from 'framer-motion'
import { useLang } from '../context/LangContext'
import { journey } from '../data'
import Eyebrow from './Eyebrow'

function Item({ j, i }) {
  const { t, sign } = useLang()
  const ref = useRef(null)
  const active = useInView(ref, { margin: '-42% 0px -42% 0px' }) // lit while it crosses the middle of the screen
  const Icon = j.icon
  const side = i % 2 === 0 ? 'l' : 'r'
  return (
    <motion.article ref={ref} className={'tl-item ' + side + (active ? ' active' : '')}
      initial={{ opacity: 0, x: (side === 'l' ? -1 : 1) * sign * 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}>
      <span className={'tl-node' + (i === journey.length - 1 ? ' now' : '')}><Icon /></span>
      <div className="tl-card">
        <div className="tl-meta"><b>{t(j.tag)}</b><span>{t(j.when)}</span></div>
        <h3>{t(j.title)}</h3>
        <p>{t(j.text)}</p>
        <div className="chips small">{j.chips.map((c) => <span key={typeof c === 'string' ? c : c.en}>{t(c)}</span>)}</div>
      </div>
    </motion.article>
  )
}

export default function Journey() {
  const { u } = useLang()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  const top = useTransform(fill, (v) => v * 100 + '%')
  return (
    <section id="journey" className="section alt">
      <div className="wrap">
        <div className="head-center">
          <Eyebrow>{u.eyebrow.journey}</Eyebrow>
          <h2 className="h2">{u.journey.h2}</h2>
          <p className="lead narrow">{u.journey.lead}</p>
        </div>
        <div className="timeline" ref={ref}>
          <div className="tl-line"><motion.i style={{ scaleY: fill }} /><motion.b className="tl-runner" style={{ top }} /></div>
          {journey.map((j, i) => <Item key={i} j={j} i={i} />)}
        </div>
      </div>
    </section>
  )
}
