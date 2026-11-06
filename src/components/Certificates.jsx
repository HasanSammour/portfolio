import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiX, FiFileText, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi'
import { useLang } from '../context/LangContext'
import { certificates } from '../data'
import { fmtDate } from '../i18n'
import Tabs from './Tabs'
import Eyebrow from './Eyebrow'

const isPdf = (f) => f.endsWith('.pdf')
const gridV = { show: { transition: { staggerChildren: 0.05 } } }
const cardV = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

function Thumb({ c }) {
  const { u } = useLang()
  const [bad, setBad] = useState(false)
  if (isPdf(c.file) || bad) return <div className="thumb ph"><FiFileText size={32} /><span>{isPdf(c.file) ? u.certs.pdf : u.certs.missing}</span></div>
  return <div className="thumb"><img src={c.file} alt="" loading="lazy" onError={() => setBad(true)} /></div>
}

function Modal({ list, index, setIndex, onClose }) {
  const { t, u, lang, isRTL } = useLang()
  const c = list[index]
  const go = useCallback((d) => setIndex((i) => (i + d + list.length) % list.length), [list.length, setIndex])
  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(isRTL ? -1 : 1)
      if (e.key === 'ArrowLeft') go(isRTL ? 1 : -1)
    }
    addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [go, onClose, isRTL])
  const Prev = isRTL ? FiChevronRight : FiChevronLeft, Next = isRTL ? FiChevronLeft : FiChevronRight
  return (
    <motion.div className="modal-bg" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal" role="dialog" aria-modal="true" aria-label={t(c.title)} onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, scale: 0.96 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
        <button className="modal-x" onClick={onClose} aria-label={u.certs.close}><FiX /></button>
        <div className="modal-media">
          <AnimatePresence mode="wait">
            <motion.div key={c.id} className="modal-fade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {isPdf(c.file) ? <iframe src={c.file} title={t(c.title)} /> : <img src={c.file} alt={t(c.title)} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="modal-info">
          <p className="proj-type" dir="auto">{t(c.issuer)}</p>
          <h3 dir="auto">{t(c.title)}</h3>
          <p className="muted">{fmtDate(c.date, lang)} · <span dir="auto">{t(c.meta)}</span></p>
          <p>{t(c.text)}</p>
          <div className="chips small">{t(c.skills).map((s) => <span key={s}>{s}</span>)}</div>
          {c.verify
            ? <a className="btn btn-main" href={c.verify} target="_blank" rel="noreferrer"><FiCheckCircle /> {u.certs.verify}</a>
            : <p className="muted small">{u.certs.none}</p>}
          <div className="modal-nav">
            <button onClick={() => go(-1)} aria-label={u.certs.prev}><Prev /></button>
            <span>{index + 1} / {list.length}</span>
            <button onClick={() => go(1)} aria-label={u.certs.next}><Next /></button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Certificates() {
  const { t, u, lang } = useLang()
  const [cat, setCat] = useState('all')
  const [open, setOpen] = useState(null)
  const list = certificates.filter((c) => cat === 'all' || c.cat === cat)
  const items = Object.entries(u.certs.f).map(([id, label]) => ({ id, label, count: certificates.filter((c) => id === 'all' || c.cat === id).length }))
  const close = useCallback(() => setOpen(null), [])
  return (
    <section id="certificates" className="section alt">
      <div className="wrap">
        <div className="head-center">
          <Eyebrow>{u.eyebrow.certs}</Eyebrow>
          <h2 className="h2">{u.certs.h2}</h2>
          <p className="lead narrow">{u.certs.lead}</p>
          <Tabs id="certs" items={items} value={cat} onChange={setCat} className="center" />
        </div>
        <motion.div key={cat} className="cert-grid" initial="hidden" animate="show" variants={gridV}>
          {list.map((c, i) => (
            <motion.button key={c.id} className="cert" variants={cardV} onClick={() => setOpen(i)}>
              <Thumb c={c} />
              <span className="cert-hover"><FiEye /> {u.certs.view}</span>
              {c.verify && <span className="cert-badge"><FiCheckCircle /> {u.certs.verified}</span>}
              <div className="cert-body">
                <strong dir="auto">{t(c.title)}</strong>
                <span dir="auto">{t(c.issuer)}</span>
                <span className="muted">{fmtDate(c.date, lang)} · <span dir="auto">{t(c.meta)}</span></span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
      <AnimatePresence>{open !== null && <Modal list={list} index={open} setIndex={setOpen} onClose={close} />}</AnimatePresence>
    </section>
  )
}
