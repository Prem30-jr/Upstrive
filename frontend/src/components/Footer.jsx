import { Link } from 'react-router-dom'
import { FiMapPin, FiMail, FiPhone, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Internships', path: '/internships' },
    { name: 'Contact', path: '/contact' },
  ]

  const programs = [
    'AI & Machine Learning',
    'MERN Stack Development',
    'Data Science',
    'Cloud Computing',
    'Cyber Security',
    'UI/UX Design',
  ]

  const socialLinks = [
    { icon: FiFacebook, color: 'hover:text-blue-600', url: '#' },
    { icon: FiTwitter, color: 'hover:text-sky-500', url: '#' },
    { icon: FiInstagram, color: 'hover:text-pink-600', url: '#' },
    { icon: FiLinkedin, color: 'hover:text-blue-700', url: '#' },
  ]

  return (
    <footer className="bg-deep-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <img src="/Herrico-logo.png" alt="Herrico Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold">Herrico</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Launch your career with structured, company-owned internships. 
              We bridge the gap between academic learning and industry expectations.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 ${social.color}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Programs</h3>
            <ul className="space-y-3">
              {programs.map((program) => (
                <li key={program}>
                  <Link
                    to="/internships"
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {program}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 mt-1 text-accent-blue" />
                <span className="text-gray-300 text-sm">
                  123 Tech Park, Sector 62<br />
                  Noida, UP 201301, India
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-accent-blue" />
                <a href="mailto:herrico.official@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                  herrico.official@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-accent-blue" />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Herrico. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
