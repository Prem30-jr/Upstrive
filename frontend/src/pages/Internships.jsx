import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiClock, FiTrendingUp, FiCpu, FiDatabase, FiCloud, FiShield, FiEdit, FiSmartphone, FiCode, FiStar } from 'react-icons/fi'

const Internships = () => {
  const [selectedDomain, setSelectedDomain] = useState('all')

  const programs = [
    {
      id: 'ai-ml',
      title: 'AI & Machine Learning',
      icon: FiCpu,
      duration: ['4 weeks', '8 weeks'],
      skills: ['Python', 'TensorFlow', 'Scikit-Learn', 'Deep Learning'],
      stipend: '₹3,000–₹8,000/month',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80'
    },
    {
      id: 'mern',
      title: 'MERN Stack Development',
      icon: FiDatabase,
      duration: ['4 weeks', '8 weeks', '12 weeks'],
      skills: ['MongoDB', 'Express', 'React', 'Node.js'],
      stipend: '₹4,000–₹10,000/month',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80'
    },
    {
      id: 'data-science',
      title: 'Data Science & Analytics',
      icon: FiTrendingUp,
      duration: ['4 weeks', '8 weeks'],
      skills: ['Python', 'Pandas', 'SQL', 'Power BI'],
      stipend: '₹3,000–₹7,000/month',
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80'
    },
    {
      id: 'cloud',
      title: 'Cloud Computing',
      icon: FiCloud,
      duration: ['4 weeks', '8 weeks'],
      skills: ['AWS', 'GCP', 'Azure', 'Docker'],
      stipend: '₹4,000–₹9,000/month',
      color: 'sky',
      gradient: 'from-sky-500 to-sky-600',
      bgColor: 'bg-sky-100',
      textColor: 'text-sky-600',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80'
    },
    {
      id: 'cyber',
      title: 'Cyber Security',
      icon: FiShield,
      duration: ['4 weeks', '8 weeks'],
      skills: ['Ethical Hacking', 'VAPT', 'Networking', 'Security'],
      stipend: '₹3,000–₹8,000/month',
      color: 'red',
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80'
    },
    {
      id: 'ui-ux',
      title: 'UI/UX Design',
      icon: FiEdit,
      duration: ['4 weeks'],
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      stipend: '₹2,000–₹6,000/month',
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80'
    },
    {
      id: 'android',
      title: 'Android Development',
      icon: FiSmartphone,
      duration: ['4 weeks', '8 weeks'],
      skills: ['Kotlin', 'Android Studio', 'Firebase', 'Jetpack'],
      stipend: '₹3,000–₹8,000/month',
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80'
    },
    {
      id: 'cpp',
      title: 'C++ Programming',
      icon: FiCode,
      duration: ['4 weeks'],
      skills: ['DSA', 'OOP', 'System Programming', 'STL'],
      stipend: '₹2,000–₹5,000/month',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80'
    },
    {
      id: 'java',
      title: 'Java Development',
      icon: FiCode,
      duration: ['4 weeks', '8 weeks'],
      skills: ['Core Java', 'Spring Boot', 'REST APIs', 'Maven'],
      stipend: '₹3,000–₹7,000/month',
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80'
    },
    {
      id: 'python',
      title: 'Python Programming',
      icon: FiCode,
      duration: ['4 weeks'],
      skills: ['Scripting', 'Automation', 'OOP', 'Libraries'],
      stipend: '₹2,000–₹5,000/month',
      color: 'yellow',
      gradient: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80'
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      icon: FiTrendingUp,
      duration: ['4 weeks'],
      skills: ['SEO', 'Google Ads', 'Analytics', 'Social Media'],
      stipend: '₹2,000–₹5,000/month',
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80'
    }
  ]

  const domains = [
    { id: 'all', name: 'All Programs' },
    { id: 'purple', name: 'AI & ML' },
    { id: 'blue', name: 'Development' },
    { id: 'green', name: 'Data & Mobile' },
    { id: 'sky', name: 'Cloud & Security' },
    { id: 'pink', name: 'Design' }
  ]

  const filteredPrograms = selectedDomain === 'all' 
    ? programs 
    : programs.filter(p => p.color === selectedDomain)

  const journeySteps = [
    { step: 1, title: 'Apply', description: 'Submit your application' },
    { step: 2, title: 'Shortlist + Interview', description: 'Review & assessment' },
    { step: 3, title: 'Onboarding', description: 'Welcome to Upstrive' },
    { step: 4, title: 'Project Work', description: 'Real-world experience' },
    { step: 5, title: 'Certificate + Placement', description: 'Launch your career' }
  ]

  return (
    <div className="pt-20">
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-deep-blue via-primary to-deep-blue overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80"
            alt="Internships Background"
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
              Explore Our <span className="text-accent-blue">Internship</span> Programs
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose from 11+ industry-relevant programs designed to launch your tech career
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-border-color sticky top-16 lg:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedDomain === domain.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-light-bg text-text-muted hover:bg-border-color'
                }`}
              >
                {domain.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${program.gradient} opacity-60`} />
                  <div className="absolute top-4 right-4">
                    <span className={`${program.bgColor} ${program.textColor} px-3 py-1 rounded-full text-sm font-medium`}>
                      {program.stipend}
                    </span>
                  </div>
                  <div className={`absolute bottom-4 left-4 w-14 h-14 ${program.bgColor} rounded-xl flex items-center justify-center`}>
                    <program.icon className={`w-7 h-7 ${program.textColor}`} />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-dark mb-3">
                    {program.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {program.duration.map((dur) => (
                      <span key={dur} className="flex items-center text-sm font-medium text-text-muted">
                        <FiClock className="w-4 h-4 mr-1" />
                        {dur}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {program.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-light-bg text-text-muted text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {program.skills.length > 3 && (
                      <span className="px-3 py-1 bg-light-bg text-text-muted text-xs font-medium rounded-full">
                        +{program.skills.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <Link
                    to={`/apply/${program.id}`}
                    className={`w-full py-3 rounded-lg font-semibold text-center bg-gradient-to-r ${program.gradient} text-white hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2`}
                  >
                    <span>Apply Now</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
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
              Your Internship Journey
            </h2>
            <p className="text-text-muted text-lg">
              From application to certificate — here's what to expect
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent-blue to-deep-blue transform -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {journeySteps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg text-center relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-deep-blue rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-text-dark mb-2">
                      {item.title}
                    </h3>
                    <p className="text-text-muted text-sm">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Internships
