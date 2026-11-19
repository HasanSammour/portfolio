import { useEffect, useState } from 'react'

// Resolves to true once the hero portrait is downloaded + decoded AND the display font is loaded,
// so the intro animation never plays while the image arrives in chunks or the text swaps fonts.
// A hard timeout guarantees the page still opens on a very slow or blocked connection.
export default function useAssetsReady(src, lang, maxWait = 4500) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let done = false
    const finish = () => { if (!done) { done = true; setReady(true) } }
    const img = new Image()
    img.src = src
    const imgReady = img.decode ? img.decode().catch(() => {}) : new Promise((r) => { img.onload = img.onerror = r })
    const font = lang === 'ar' ? '700 48px Cairo' : '800 48px "Bricolage Grotesque"'
    const fontReady = document.fonts?.load ? Promise.all([document.fonts.load(font), document.fonts.load('500 16px Figtree')]).catch(() => {}) : Promise.resolve()
    Promise.all([imgReady, fontReady]).then(finish)
    const timer = setTimeout(finish, maxWait)
    return () => clearTimeout(timer)
  }, [src]) // eslint-disable-line react-hooks/exhaustive-deps
  return ready
}
