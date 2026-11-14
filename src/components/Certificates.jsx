import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiX, FiFileText, FiChevronLeft, FiChevronRight, FiEye, FiSearch, FiAward, FiClock, FiLayers, FiExternalLink, FiCopy, FiCheck, FiZoomIn } from 'react-icons/fi'
import { useLang } from '../context/LangContext'
import { certificates } from '../data'
import { fmtDate } from '../i18n'
import useTilt from '../hooks/useTilt'
import Tabs from './Tabs'
import Eyebrow from './Eyebrow'

const isPdf = (f) => f.endsWith('.pdf')
const CAT_COLOR = { eng: '#9EC347', ai: '#B79CFF', support: '#FFC24B', career: '#6BA8FF' }
const haystack = (c) => [c.title.en, c.title.ar, c.issuer.en, c.issuer.ar, ...c.skills.en, ...c.skills.ar, c.code || ''].join(' ').toLowerCase()
const HAY = Object.fromEntries(certificates.map((c) => [c.id, haystack(c)]))

function Thumb({ c }) {
  const { u } = useLang()
  const [bad, setBad] = useState(false)
  if (isPdf(c.file) || bad) return <div className="thumb ph"><FiFileText size={34} /><span>{isPdf(c.file) ? u.certs.pdf : u.certs.missing}</span></div>
  return <div className="thumb"><img src={c.file} alt="" loading="lazy" onError={() => setBad(true)} /></div>
}

function Card({ c, i, onOpen }) {
  const { t, u, lang } = useLang()
  const tilt = useTilt(5)
  return (
    <motion.button className="cert tilt" style={{ '--accent': CAT_COLOR[c.cat], ...tilt.style }} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave} onClick={onOpen}
      initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.045, duration: 0.45 }}>
      <div className="cert-media">
        <Thumb c={c} />
        <span className="cert-cat">{u.certs.f[c.cat]}</span>
        {c.verify && <span className="cert-badge"><FiCheckCircle /> {u.certs.verified}</span>}
        {c.hours && <span className="cert-hours"><FiClock /> {u.certs.hours(c.hours)}</span>}
        <span className="cert-hover"><FiEye /> {u.certs.view}</span>
      </div>
      <div className="cert-body">
        <strong dir="auto">{t(c.title)}</strong>
        <span className="cert-issuer" dir="auto">{t(c.issuer)}</span>
        <span className="cert-date">{fmtDate(c.date, lang)}</span>
        <div className="cert-tags">{t(c.skills).slice(0, 3).map((s) => <i key={s}>{s}</i>)}</div>
      </div>
    </motion.button>
  )
}

function Modal({ list, index, setIndex, onClose }) {
  const { t, u, lang, isRTL } = useLang()
  const c = list[index]
  const [zoom, setZoom] = useState(false)
  const [copied, setCopied] = useState(false)
  const go = useCallback((d) => { setZoom(false); setIndex((i) => (i + d + list.length) % list.length) }, [list.length, setIndex])
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
  const copy = async () => { try { await navigator.clipboard.writeText(c.code); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch {} }
  const Prev = isRTL ? FiChevronRight : FiChevronLeft, Next = isRTL ? FiChevronLeft : FiChevronRight
  const needsCode = c.verify && c.code && !c.verify.includes(c.code)
  return (
    <motion.div className="modal-bg" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal" style={{ '--accent': CAT_COLOR[c.cat] }} role="dialog" aria-modal="true" aria-label={t(c.title)} onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, scale: 0.96 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
        <button className="modal-x" onClick={onClose} aria-label={u.certs.close}><FiX /></button>
        <div className={'modal-media' + (zoom ? ' zoomed' : '')}>
          <AnimatePresence mode="wait">
            <motion.div key={c.id} className="modal-fade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {isPdf(c.file) ? <iframe src={c.file} title={t(c.title)} /> : <img src={c.file} alt={t(c.title)} onClick={() => setZoom(!zoom)} />}
            </motion.div>
          </AnimatePresence>
          {!isPdf(c.file) && !zoom && <span className="zoom-hint"><FiZoomIn /> {u.certs.zoom}</span>}
        </div>
        <div className="modal-info">
          <span className="modal-cat">{u.certs.f[c.cat]}</span>
          <p className="proj-type" dir="auto">{t(c.issuer)}</p>
          <h3 dir="auto">{t(c.title)}</h3>
          <div className="modal-meta">
            <span><FiAward />{fmtDate(c.date, lang)}</span>
            {c.hours && <span><FiClock />{u.certs.hours(c.hours)}</span>}
          </div>
          <p>{t(c.text)}</p>
          <div className="chips small">{t(c.skills).map((s) => <span key={s}>{s}</span>)}</div>
          {c.code && (
            <div className="cred">
              <small>{u.certs.credId}</small>
              <code dir="ltr">{c.code}</code>
              <button type="button" onClick={copy} aria-live="polite">{copied ? <><FiCheck /> {u.certs.copiedId}</> : <><FiCopy /> {u.certs.copyId}</>}</button>
            </div>
          )}
          <div className="modal-actions">
            {c.verify
              ? <a className="btn btn-main" href={c.verify} target="_blank" rel="noreferrer"><FiCheckCircle /> {u.certs.verify}</a>
              : null}
            <a className="btn btn-ghost" href={c.file} target="_blank" rel="noreferrer"><FiExternalLink /> {u.certs.open}</a>
          </div>
          {needsCode && <p className="muted small">{u.certs.enter}</p>}
          {!c.verify && <p className="muted small">{u.certs.none}</p>}
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
  const { u } = useLang()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)

  const total = certificates.length
  const stats = useMemo(() => [
    [FiAward, total], [FiCheckCircle, certificates.filter((c) => c.verify).length],
    [FiClock, certificates.reduce((a, c) => a + (c.hours || 0), 0) + '+'], [FiLayers, new Set(certificates.map((c) => c.issuer.en)).size],
  ], [total])

  const query = q.trim().toLowerCase()
  const searched = certificates.filter((c) => !query || HAY[c.id].includes(query))
  const list = searched.filter((c) => cat === 'all' || c.cat === cat)
  const items = Object.entries(u.certs.f).map(([id, label]) => ({ id, label, count: searched.filter((c) => id === 'all' || c.cat === id).length }))
  const close = useCallback(() => setOpen(null), [])

  return (
    <section id="certificates" className="section alt">
      <div className="wrap">
        <div className="head-center">
          <Eyebrow>{u.eyebrow.certs}</Eyebrow>
          <h2 className="h2">{u.certs.h2}</h2>
          <p className="lead narrow">{u.certs.lead}</p>
        </div>

        <div className="cert-stats">
          {stats.map(([Icon, n], i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <span><Icon /></span><strong>{n}</strong><small>{u.certs.stats[i]}</small>
            </motion.div>
          ))}
        </div>

        <div className="cert-tools">
          <Tabs id="certs" items={items} value={cat} onChange={setCat} className="center" />
          <label className="cert-search">
            <FiSearch />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={u.certs.search} aria-label={u.certs.search} />
            {q && <button type="button" onClick={() => setQ('')} aria-label={u.certs.clear}><FiX /></button>}
          </label>
          <p className="cert-count" aria-live="polite">{u.certs.results(list.length)}</p>
        </div>

        <div key={cat} className="cert-grid">
          {list.map((c, i) => <Card key={c.id} c={c} i={i} onOpen={() => setOpen(i)} />)}
        </div>
        {list.length === 0 && <p className="cert-empty">{u.certs.empty}</p>}
      </div>
      <AnimatePresence>{open !== null && <Modal list={list} index={open} setIndex={setOpen} onClose={close} />}</AnimatePresence>
    </section>
  )
}
