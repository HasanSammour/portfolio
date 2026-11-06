import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { FiMapPin } from 'react-icons/fi'
import { useLang } from '../context/LangContext'
import { profile, tabs, orbit } from '../data'
import Tabs from './Tabs'
import Marquee from './Marquee'

const word = { hidden: { y: '115%' }, show: (i) => ({ y: 0, transition: { delay: 2.0 + i * 0.14, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } }) }
const fade = (d) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.65, ease: 'easeOut' } })

export default function Hero() {
  const { t, u, lang } = useLang()
  const ref = useRef(null)
  const [tab, setTab] = useState('dev')
  const [auto, setAuto] = useState(true)

  // auto-rotate the role tabs until the visitor picks one
  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => setTab((c) => tabs[(tabs.findIndex((x) => x.id === c) + 1) % tabs.length].id), 6500)
    return () => clearInterval(id)
  }, [auto])

  // scroll: the stage lifts and shrinks, the text drifts up and fades. Nothing leaves the screen sideways.
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const stageY = useTransform(p, [0, 1], ['0vh', '-8vh'])
  const stageScale = useTransform(p, [0, 1], [1, 0.85])
  const stageOpacity = useTransform(p, [0.45, 0.95], [1, 0])
  const textY = useTransform(p, [0, 1], ['0vh', '-5vh'])
  const textOpacity = useTransform(p, [0.5, 0.95], [1, 0])
  const blobScale = useTransform(p, [0, 1], [1, 1.5])

  // pointer parallax on the portrait
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rotY = useSpring(useTransform(mx, [-1, 1], [-9, 9]), { stiffness: 120, damping: 18 })
  const rotX = useSpring(useTransform(my, [-1, 1], [8, -8]), { stiffness: 120, damping: 18 })
  const onMove = (e) => { if (e.pointerType === 'touch') return; mx.set((e.clientX / innerWidth) * 2 - 1); my.set((e.clientY / innerHeight) * 2 - 1) }

  const cur = tabs.find((x) => x.id === tab)
  const ar = lang === 'ar'
  const words = [t(profile.first), t(profile.last)]

  return (
    <section id="top" ref={ref} className="hero" onPointerMove={onMove}>
      <div className="hero-inner">
        <motion.div className="hero-bg" style={{ scale: blobScale }} aria-hidden><i className="b1" /><i className="b2" /></motion.div>
        <div className="hero-main">
          <div className="hero-grid">
            <motion.div className="stage" style={{ y: stageY, scale: stageScale, opacity: stageOpacity }}>
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="shock" initial={{ scale: 0.1, opacity: 0 }} animate={{ scale: [0.1, 2.6], opacity: [0.65, 0] }} transition={{ delay: 0.55 + i * 0.22, duration: 1.4, ease: 'easeOut' }} />
              ))}
              <motion.span className="dot" initial={{ y: '-80vh' }}
                animate={{ y: ['-80vh', '0vh', '-16vh', '0vh', '-5vh', '0vh'], scaleX: [0.8, 1.35, 0.95, 1.15, 1, 1], scaleY: [1.4, 0.65, 1.1, 0.8, 1, 1], opacity: [1, 1, 1, 1, 1, 0] }}
                transition={{ duration: 1.5, times: [0, 0.38, 0.58, 0.76, 0.9, 1], ease: 'easeIn' }} />
              <motion.div className="orbit" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.5, duration: 0.9 }}>
                <div className="orbit-spin">
                  {orbit.map(([Icon, c], i) => {
                    const a = (i / orbit.length) * Math.PI * 2 - Math.PI / 4
                    return (
                      <span key={i} className="o-pos" style={{ left: 50 + 50 * Math.cos(a) + '%', top: 50 + 50 * Math.sin(a) + '%' }}>
                        <span className="o-chip" style={{ color: c }}><Icon size={22} /></span>
                      </span>
                    )
                  })}
                </div>
              </motion.div>
              <motion.div className="portrait-wrap" style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}>
                <div className="ring ring-a" /><div className="ring ring-b" />
                <motion.div className="portrait" initial={{ clipPath: 'circle(0% at 50% 50%)' }} animate={{ clipPath: 'circle(71% at 50% 50%)' }} transition={{ delay: 1.45, duration: 0.95, ease: [0.7, 0, 0.2, 1] }}>
                  <img src={profile.photo} alt={profile.fullEn} />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div className="hero-text" style={{ y: textY, opacity: textOpacity }}>
              <motion.div className="open-pill" {...fade(1.9)}><i />{u.hero.open}</motion.div>
              <motion.p className="hi" {...fade(2.0)}><span />{u.hero.hi}</motion.p>
              <h1 className="name" aria-label={ar ? profile.fullAr : profile.fullEn}>
                {words.map((w, i) => (
                  <span className="mask" key={w}><motion.span className={i ? 'w out' : 'w'} custom={i} variants={word} initial="hidden" animate="show">{w}</motion.span></span>
                ))}
              </h1>
              <motion.p className="hello" {...fade(2.45)}><FiMapPin />{u.hero.hello}</motion.p>

              <motion.div {...fade(2.6)} onPointerEnter={() => setAuto(false)}>
                <Tabs id="hero" items={tabs.map((x) => ({ id: x.id, label: t(x.label) }))} value={tab} onChange={(v) => { setAuto(false); setTab(v) }} />
                <AnimatePresence mode="wait">
                  <motion.div key={cur.id + lang} className="tab-body" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
                    <p>{t(cur.text)}</p>
                    <div className="chips">{cur.chips.map((c, i) => <motion.span key={c} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 * i + 0.1 }}>{c}</motion.span>)}</div>
                  </motion.div>
                </AnimatePresence>
                <div className="cta">
                  <a className="btn btn-main" href="#projects">{u.hero.work}</a>
                  <a className="btn btn-ghost" href="#contact">{u.hero.contact}</a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <Marquee />
      </div>
    </section>
  )
}
