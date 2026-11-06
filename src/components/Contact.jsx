import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLinkedin, FiGithub, FiPhone, FiCopy, FiCheck, FiClock, FiBriefcase, FiGlobe, FiSend, FiAlertCircle, FiArrowUpRight } from 'react-icons/fi'
import { useLang } from '../context/LangContext'
import { profile } from '../data'
import Eyebrow from './Eyebrow'

// Posts to Web3Forms (free, no server needed). Without a key it falls back to opening the visitor's mail app.
const KEY = import.meta.env.VITE_WEB3FORMS_KEY
const TOPICS_EN = ['Full-stack role', 'AI engineering', 'Technical support', 'Something else']
const MAX = 1000, COOLDOWN = 30000, TIMEOUT = 12000
const valid = {
  name: (v) => v.trim().length >= 2,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  message: (v) => v.trim().length >= 10,
}
const store = {
  get: (k) => { try { return localStorage.getItem(k) } catch { return null } },
  set: (k, v) => { try { localStorage.setItem(k, v) } catch {} },
  del: (k) => { try { localStorage.removeItem(k) } catch {} },
}
const loadDraft = () => { try { return JSON.parse(store.get('contact:draft')) || {} } catch { return {} } }

// defined outside Contact on purpose: a component created inside would remount (and drop focus) on every keystroke
function Field({ k, label, error, children }) {
  return (
    <div className={'field' + (error ? ' bad' : '')}>
      {children}<span>{label}</span>
      <small id={`c-${k}-err`} className="f-err" role={error ? 'alert' : undefined}><FiAlertCircle />{error}</small>
    </div>
  )
}

export default function Contact() {
  const { t, u } = useLang()
  const draft = useRef(loadDraft()).current
  const [f, setF] = useState({ name: draft.name || '', email: draft.email || '', message: draft.message || '' })
  const [hp, setHp] = useState('')
  const [topic, setTopic] = useState(draft.topic || 0)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error | offline | wait
  const [copied, setCopied] = useState(false)
  const refs = { name: useRef(null), email: useRef(null), message: useRef(null) }
  const factIcons = [FiClock, FiBriefcase, FiGlobe]

  // keep a draft so a reload or an accidental close never loses what was typed
  useEffect(() => { store.set('contact:draft', JSON.stringify({ ...f, topic })) }, [f, topic])

  const err = (k) => (touched[k] && !valid[k](f[k]) ? u.contact.err[k] : '')
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value.slice(0, k === 'message' ? MAX : 120) }); if (status !== 'sending') setStatus('idle') }
  const blur = (k) => () => setTouched((x) => ({ ...x, [k]: true }))

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch {}
  }

  const submit = async (e) => {
    e.preventDefault()
    if (hp || status === 'sending') return // honeypot + double-submit guard
    setTouched({ name: true, email: true, message: true })
    const bad = ['name', 'email', 'message'].find((k) => !valid[k](f[k]))
    if (bad) { refs[bad].current?.focus(); return }
    if (Date.now() - Number(store.get('contact:last') || 0) < COOLDOWN) { setStatus('wait'); return }
    if (!navigator.onLine) { setStatus('offline'); return }

    const subject = `Portfolio: ${TOPICS_EN[topic]} (${f.name.trim()})`
    const body = `Topic: ${TOPICS_EN[topic]}\n\n${f.message.trim()}`
    if (!KEY) {
      location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body + '\n\n' + f.name.trim() + '\n' + f.email.trim())}`
      return
    }
    setStatus('sending')
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), TIMEOUT)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', signal: ctrl.signal, headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: KEY, name: f.name.trim(), email: f.email.trim(), message: body, subject, from_name: 'Portfolio' }),
      })
      const data = await res.json()
      if (data.success) {
        store.set('contact:last', String(Date.now())); store.del('contact:draft')
        setStatus('sent'); setF({ name: '', email: '', message: '' }); setTouched({}); setTopic(0)
      } else setStatus('error')
    } catch { setStatus(navigator.onLine ? 'error' : 'offline') } finally { clearTimeout(timer) }
  }

  const notice = { error: u.contact.error, offline: u.contact.offline, wait: u.contact.wait }[status]
  const sent = status === 'sent'
  const cards = [
    { Icon: FiLinkedin, label: 'LinkedIn', sub: 'hasan-sammour', href: profile.linkedin },
    { Icon: FiGithub, label: 'GitHub', sub: 'HasanSammour', href: profile.github },
    { Icon: FiPhone, label: profile.phone, sub: t(profile.location), href: `tel:${profile.phone}`, ltr: true, wide: true },
  ]

  return (
    <section id="contact" className="section contact-section">
      <div className="contact-glow" aria-hidden><i /><i /></div>
      <div className="wrap">
        <div className="head-center">
          <div className="open-pill"><i />{u.contact.open}</div>
          <Eyebrow>{u.eyebrow.contact}</Eyebrow>
          <h2 className="h2">{u.contact.h2}</h2>
          <p className="lead narrow">{u.contact.lead}</p>
        </div>

        <div className="contact">
          <div className="contact-left">
            <div className="c-facts">
              {u.contact.facts.map(([k, v], i) => {
                const Icon = factIcons[i]
                return (
                  <motion.div key={k} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Icon /><div><small>{k}</small><b>{v}</b></div>
                  </motion.div>
                )
              })}
            </div>
            <div className="mail-card">
              <span className="mc-icon"><FiMail /></span>
              <a href={`mailto:${profile.email}`} dir="ltr">{profile.email}</a>
              <button type="button" onClick={copy} aria-live="polite">{copied ? <><FiCheck /> {u.contact.copied}</> : <><FiCopy /> {u.contact.copy}</>}</button>
            </div>
            <div className="c-cards">
              {cards.map(({ Icon, label, sub, href, ltr, wide }, i) => (
                <motion.a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={'c-card' + (wide ? ' wide' : '')}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}>
                  <Icon className="ci" /><FiArrowUpRight className="arr" /><span><b dir={ltr ? 'ltr' : undefined}>{label}</b><small>{sub}</small></span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* form and success state share one grid cell, so the card never changes height */}
          <div className="form-wrap">
            <form className={'form' + (sent ? ' gone' : '')} onSubmit={submit} noValidate inert={sent ? '' : undefined} aria-hidden={sent}>
              <h3 className="form-title">{u.contact.title}</h3>
              <fieldset className="topics" role="radiogroup" aria-label={u.contact.topicLabel}>
                <legend>{u.contact.topicLabel}</legend>
                {u.contact.topics.map((x, i) => (
                  <button type="button" key={x} role="radio" aria-checked={i === topic} className={i === topic ? 'topic on' : 'topic'} onClick={() => setTopic(i)}>{x}</button>
                ))}
              </fieldset>
              <div className="two">
                <Field k="name" label={u.contact.name} error={err('name')}>
                  <input ref={refs.name} id="c-name" name="name" placeholder=" " value={f.name} onChange={set('name')} onBlur={blur('name')} autoComplete="name" enterKeyHint="next" aria-invalid={!!err('name')} aria-describedby="c-name-err" />
                </Field>
                <Field k="email" label={u.contact.email} error={err('email')}>
                  <input ref={refs.email} id="c-email" name="email" type="email" inputMode="email" placeholder=" " value={f.email} onChange={set('email')} onBlur={blur('email')} autoComplete="email" enterKeyHint="next" dir="auto" aria-invalid={!!err('email')} aria-describedby="c-email-err" />
                </Field>
              </div>
              <Field k="message" label={u.contact.message} error={err('message')}>
                <textarea ref={refs.message} id="c-message" name="message" rows="5" placeholder=" " value={f.message} onChange={set('message')} onBlur={blur('message')} aria-invalid={!!err('message')} aria-describedby="c-message-err" />
                <em className="count" dir="ltr">{f.message.length}/{MAX}</em>
              </Field>
              <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden value={hp} onChange={(e) => setHp(e.target.value)} name="website" />
              <p className={'form-note' + (notice ? ' err' : '')} role="status" aria-live="polite">
                {notice ? <><FiAlertCircle />{notice}</> : !KEY ? u.contact.hint : (f.message || f.name) ? u.contact.draft : ''}
              </p>
              <button className="btn btn-main send" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? <><i className="spin" /> {u.contact.sending}</> : <>{u.contact.send} <FiSend /></>}
              </button>
            </form>
            <AnimatePresence>
              {sent && (
                <motion.div className="sent" role="status" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <svg viewBox="0 0 64 64" width="76" height="76" aria-hidden>
                    <motion.circle cx="32" cy="32" r="28" fill="none" stroke="var(--leaf)" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
                    <motion.path d="M20 33 L29 42 L45 24" fill="none" stroke="var(--leaf)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.4 }} />
                  </svg>
                  <h3>{u.contact.sent}</h3><p>{u.contact.sentText}</p>
                  <button className="btn btn-ghost" onClick={() => setStatus('idle')}>{u.contact.again}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
