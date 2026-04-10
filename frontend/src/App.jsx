import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingApplyButton from './components/FloatingApplyButton'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Internships from './pages/Internships'
import Apply from './pages/Apply'
import Contact from './pages/Contact'

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply/:id" element={<Apply />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  useEffect(() => {
    import('aos').then(() => {
      window.AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
      })
    })
  }, [])

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />
        <FloatingApplyButton />
      </div>
    </Router>
  )
}

export default App
