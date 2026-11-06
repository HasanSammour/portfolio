import { useMotionValue, useSpring } from 'framer-motion'
// 3D tilt + cursor glow position (--gx / --gy CSS variables) for cards.
export default function useTilt(max = 7) {
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 220, damping: 20 })
  const rotateY = useSpring(ry, { stiffness: 220, damping: 20 })
  return {
    style: { rotateX, rotateY, transformPerspective: 900 },
    onPointerMove: (e) => {
      if (e.pointerType === 'touch') return
      const r = e.currentTarget.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
      ry.set((px - 0.5) * max * 2); rx.set(-(py - 0.5) * max * 2)
      e.currentTarget.style.setProperty('--gx', px * 100 + '%')
      e.currentTarget.style.setProperty('--gy', py * 100 + '%')
    },
    onPointerLeave: () => { rx.set(0); ry.set(0) },
  }
}
