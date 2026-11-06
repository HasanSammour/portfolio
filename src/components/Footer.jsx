import { useEffect, useState } from 'react'
import { FiLinkedin, FiGithub, FiMail, FiArrowUp, FiGlobe } from 'react-icons/fi'
import { useLang } from '../context/LangContext'
import { profile } from '../data'

const keys = ['about', 'skills', 'journey', 'projects', 'certificates', 'contact']

function GazaTime() {
  const { lang } = useLang()
  const fmt = () => new Intl.DateTimeFormat(lang === 'ar' ? 'ar-u-nu-latn' : 'en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Gaza' }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => { setTime(fmt()); const id = setInterval(() => setTime(fmt()), 20000); return () => clearInterval(id) }, [lang]) // eslint-disable-line
  return <span className="gaza-time" dir="ltr">{time}</span>
}

export default function Footer() {
  const { u, toggle } = useLang()
  return (
    <footer className="footer">
      <img className="foot-mark" src="/logo-large.png" alt="" aria-hidden />
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <a href="#top" className="nav-logo"><img src="/logo.png" srcSet="/logo.png 1x, /logo@2x.png 2x" alt="" width="34" height="40" /><span>Hasan Sammour</span></a>
          <p>{u.footer.tagline}</p>
          <div className="foot-time"><i />{u.footer.time}<GazaTime /></div>
        </div>
        <nav aria-label={u.footer.explore}>
          <h4>{u.footer.explore}</h4>
          {keys.map((k) => <a key={k} href={'#' + k}>{u.nav[k]}</a>)}
        </nav>
        <div>
          <h4>{u.footer.connect}</h4>
          <div className="foot-social">
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FiGithub /></a>
            <a href={`mailto:${profile.email}`} aria-label="Email"><FiMail /></a>
          </div>
          <button className="lang-btn" onClick={toggle} aria-label={u.langLabel}><FiGlobe /> {u.langBtn}</button>
        </div>
      </div>
      <div className="wrap foot-bottom">
        <span>© {new Date().getFullYear()} {u.footer.rights}</span>
        <span>{u.footer.made}</span>
        <a href="#top" className="to-top"><FiArrowUp /> {u.footer.top}</a>
      </div>
    </footer>
  )
}
