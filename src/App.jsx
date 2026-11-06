import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
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

export default function App() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="progress" style={{ scaleX }} />
      <Spotlight />
      <Navbar />
      <main>
        <Hero />
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
