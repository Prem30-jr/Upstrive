import { Link } from 'react-router-dom'
import { FiSend } from 'react-icons/fi'
import { motion } from 'framer-motion'

const FloatingApplyButton = () => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link
        to="/internships"
        className="flex items-center space-x-2 bg-primary hover:bg-deep-blue text-white font-semibold py-4 px-6 rounded-full shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 group"
      >
        <span className="hidden sm:inline">Explore Programs</span>
        <FiSend className="w-5 h-5 animate-pulse" />
      </Link>
    </motion.div>
  )
}

export default FloatingApplyButton
