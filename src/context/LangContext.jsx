import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ui } from '../i18n'

const Ctx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') || (navigator.language?.startsWith('ar') ? 'ar' : 'en') } catch { return 'en' }
  })
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try { localStorage.setItem('lang', lang) } catch {}
  }, [lang])
  const t = useCallback((v) => (v && typeof v === 'object' && !Array.isArray(v) ? v[lang] : v), [lang])
  const value = useMemo(() => ({
    lang, isRTL: lang === 'ar', dir: lang === 'ar' ? 'rtl' : 'ltr', sign: lang === 'ar' ? -1 : 1,
    t, u: ui[lang], toggle: () => setLang((l) => (l === 'en' ? 'ar' : 'en')),
  }), [lang, t])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useLang = () => useContext(Ctx)
