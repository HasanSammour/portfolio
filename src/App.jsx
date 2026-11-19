import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import Spotlight from './components/Spotlight'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Journey from './components/Journey'
import Projects from './components/Projects'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
import Footer from './components/Footer'
import useAssetsReady from './hooks/useAssetsReady'
import { useLang } from './context/LangContext'
import { profile } from './data'

export default function App() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const { lang } = useLang()
  const ready = useAssetsReady(profile.photo, lang)
  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="progress" style={{ scaleX }} />
      <Analytics />
      <Spotlight />
      <Navbar ready={ready} />
      <main>
        <Hero ready={ready} />
        <About />
        <Skills />
        <Journey />
        <Projects />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
