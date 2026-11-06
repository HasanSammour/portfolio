import { useEffect, useRef } from 'react'

// Smoothly follows the cursor: a soft two-colour glow plus a dot grid that only shows near the pointer.
export default function Spotlight() {
  const ref = useRef(null)
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    let x = innerWidth / 2, y = innerHeight / 3, tx = x, ty = y, raf
    const move = (e) => { tx = e.clientX; ty = e.clientY; el.style.opacity = 1 }
    const leave = () => { el.style.opacity = 0 }
    const loop = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12
      el.style.setProperty('--x', x.toFixed(1) + 'px'); el.style.setProperty('--y', y.toFixed(1) + 'px')
      raf = requestAnimationFrame(loop)
    }
    addEventListener('pointermove', move); document.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(loop)
    return () => { removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ref} className="spotlight" aria-hidden />
}
