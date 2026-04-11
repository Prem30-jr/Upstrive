import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiBriefcase, FiUsers, FiFileText, FiTrendingUp, FiCode, FiAward } from 'react-icons/fi'

const Services = () => {
  const services = [
    {
      icon: FiBriefcase,
      title: 'Internship Programs',
      description: 'Structured, domain-specific programs across 11 tech and business domains designed for real-world impact.',
      gradient: 'from-blue-500 to-blue-600',
      features: ['Domain-specific curriculum', 'Real project work', 'Performance tracking']
    },
    {
      icon: FiUsers,
      title: 'Expert Mentorship',
      description: '1-on-1 sessions with industry professionals who guide your technical growth every step of the way.',
      gradient: 'from-purple-500 to-purple-600',
      features: ['1-on-1 sessions', 'Industry experts', 'Personal guidance']
    },
    {
      icon: FiFileText,
      title: 'Resume & Portfolio Review',
      description: 'Professional review and feedback to make your profile stand out to recruiters and hiring managers.',
      gradient: 'from-green-500 to-green-600',
      features: ['Professional review', 'ATS optimization', 'Portfolio building']
    },
    {
      icon: FiTrendingUp,
      title: 'Placement Assistance',
      description: 'Mock interviews, LinkedIn optimization, and direct referrals to hiring partners for your success.',
      gradient: 'from-orange-500 to-orange-600',
      features: ['Mock interviews', 'LinkedIn optimization', 'Direct referrals']
    },
    {
      icon: FiCode,
      title: 'Live Project Work',
      description: 'Contribute to real projects — not dummy tasks — adding genuine value to your professional portfolio.',
      gradient: 'from-teal-500 to-teal-600',
      features: ['Real projects', 'GitHub portfolio', 'Production experience']
    },
    {
      icon: FiAward,
      title: 'Certificate of Completion',
      description: 'Industry-recognized completion certificates shared directly on LinkedIn for your professional profile.',
      gradient: 'from-yellow-500 to-yellow-600',
      features: ['Industry recognized', 'LinkedIn shareable', 'Verification available']
    }
  ]

  return (
    <div className="pt-20">
      <section className="relative py-20 lg:py-32 bg-deep-blue overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=80"
            alt="Services Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Everything You Need to<br />
              <span className="text-accent-blue">Launch Your Career</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Clarix isn't just an internship. It's a complete career launchpad — 
              from skill-building to placement support.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-border-color rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-10 rounded-bl-full`} />
                
                <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  {service.title}
                </h3>
                <p className="text-base text-text-muted leading-relaxed mb-6">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-text-muted">
                      <span className={`w-2 h-2 bg-gradient-to-br ${service.gradient} rounded-full mr-3`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-deep-blue rounded-3xl p-8 lg:p-16 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
            </div>
            
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Join hundreds of students who have transformed their careers with Clarix internships.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/apply"
                  className="bg-white text-primary font-semibold py-4 px-8 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Apply Now
                </Link>
                <Link
                  to="/internships"
                  className="border-2 border-white text-white font-semibold py-4 px-8 rounded-full hover:bg-white hover:text-primary transition-colors"
                >
                  View Programs
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Services
