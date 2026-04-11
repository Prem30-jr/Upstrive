import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiChevronDown, FiUsers, FiBriefcase, FiBook, FiStar } from 'react-icons/fi'
import Typewriter from 'typewriter-effect'

const Home = () => {
  const [counters, setCounters] = useState({
    students: 0,
    placements: 0,
    programs: 0,
    satisfaction: 0
  })

  const stats = [
    { icon: FiUsers, value: 500, label: 'Students Enrolled', color: 'text-primary', suffix: '+' },
    { icon: FiBriefcase, value: 200, label: 'Successful Placements', color: 'text-green-500', suffix: '+' },
    { icon: FiBook, value: 15, label: 'Programs Available', color: 'text-purple-500', suffix: '+' },
    { icon: FiStar, value: 95, label: 'Satisfaction Rate', color: 'text-orange-500', suffix: '%' }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters()
        }
      },
      { threshold: 0.5 }
    )

    const statsSection = document.getElementById('stats-section')
    if (statsSection) {
      observer.observe(statsSection)
    }

    return () => observer.disconnect()
  }, [])

  const animateCounters = () => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setCounters({
        students: Math.floor(500 * easeOut),
        placements: Math.floor(200 * easeOut),
        programs: Math.floor(15 * easeOut),
        satisfaction: Math.floor(95 * easeOut)
      })

      if (step >= steps) clearInterval(timer)
    }, interval)
  }

  const features = [
    {
      title: 'Structured Programs',
      description: 'Real projects, not dummy tasks. Gain hands-on experience with measurable outcomes.',
      icon: '💼',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Expert Mentors',
      description: 'Learn from working professionals who guide your technical growth every step.',
      icon: '🎓',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Career Support',
      description: 'Resume building, mock interviews & placement assistance for your success.',
      icon: '🚀',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Industry Certificate',
      description: 'Recognized certificates shared directly on LinkedIn for your professional profile.',
      icon: '🏆',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-blue/90 to-primary/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            ><br></br>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Launch Your Career with{' '}
                <span className="text-accent-blue">Real-World</span> Internships
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-xl mx-auto lg:mx-0">
                Clarix connects ambitious students with structured, company-owned 
                internship programs in the most in-demand tech domains.
              </p>

              <div className="text-2xl sm:text-3xl font-bold text-white mb-8">
                <span className="text-accent-blue">Domain:</span>{' '}
                <Typewriter
                  options={{
                    strings: ['AI/ML', 'MERN Stack', 'Data Science', 'Cloud Computing'],
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 50,
                    delay: 100,
                    wrapperClassName: 'text-accent-blue'
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/apply" className="btn-primary inline-flex items-center justify-center space-x-2">
                  <span>Apply Now</span>
                  <FiArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/internships" className="btn-secondary border-white text-white hover:bg-white hover:text-deep-blue inline-flex items-center justify-center space-x-2">
                  <span>Explore Programs</span>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-gray-300 text-sm">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">15+</div>
                  <div className="text-gray-300 text-sm">Programs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">95%</div>
                  <div className="text-gray-300 text-sm">Satisfaction</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full h-96 lg:h-[500px]">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80"
                  alt="Students working"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FiStar className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <div className="font-bold text-text-dark">Rated 4.9/5</div>
                      <div className="text-text-muted text-sm">by students</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <FiChevronDown className="w-8 h-8 text-white opacity-60" />
        </motion.div>
      </section>

      <section id="stats-section" className="py-20 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                <div className="text-4xl font-bold text-text-dark mb-2">
                  {counters[Object.keys(counters)[index]]}{stat.suffix}
                </div>
                <div className="text-text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-deep-blue mb-4">
              Why Choose Clarix?
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              We provide everything you need to launch a successful tech career
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-border-color rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-base text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-deep-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to kickstart your career?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Join 500+ students who chose Clarix to launch their professional journey
            </p>
            <Link to="/apply" className="inline-flex items-center space-x-2 bg-white text-primary font-semibold py-4 px-8 rounded-full hover:bg-gray-100 transition-colors">
              <span>Get Started Today</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
