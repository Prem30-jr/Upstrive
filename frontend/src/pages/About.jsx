import { motion } from 'framer-motion'
import { FiTarget, FiEye, FiHeart, FiZap, FiShield, FiGlobe } from 'react-icons/fi'

const About = () => {
  const values = [
    {
      icon: FiZap,
      title: 'Innovation',
      description: 'We embrace new technologies and encourage creative problem-solving in every program',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    {
      icon: FiTarget,
      title: 'Real-World Learning',
      description: 'No dummy projects. Students work on actual use-cases with measurable outcomes',
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      icon: FiGlobe,
      title: 'Career Growth',
      description: 'Every program is designed with placement and professional development as the end goal',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    },
    {
      icon: FiShield,
      title: 'Transparency',
      description: 'Clear processes, honest feedback, and open communication throughout the journey',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      icon: FiHeart,
      title: 'Inclusivity',
      description: 'We welcome students from all backgrounds, colleges, and cities',
      color: 'text-red-500',
      bgColor: 'bg-red-100'
    }
  ]

  const stats = [
    { number: '2020', label: 'Founded' },
    { number: 'Noida', label: 'HQ Location' },
    { number: '500+', label: 'Students Served' }
  ]

  return (
    <div className="pt-20">
      <section className="relative py-20 lg:py-32 bg-light-bg overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%230D47A1" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-deep-blue mb-6">
                Who We Are
              </h1>
              <p className="text-text-muted text-lg mb-6 leading-relaxed">
                Herrico was founded with one mission — to make high-quality, structured 
                internships accessible to every student, regardless of their college or city.
              </p>
              <p className="text-text-muted text-lg mb-8 leading-relaxed">
                We believe that talent is universal, but opportunities are not. That's why 
                we created a platform where students can gain real industry experience through 
                company-owned internship programs designed by working professionals.
              </p>
              
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-primary">
                      {stat.number}
                    </div>
                    <div className="text-text-muted text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl w-full"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl max-w-xs"
              >
                <div className="text-primary font-bold text-lg mb-2">
                  "Bridging the gap between academia and industry"
                </div>
                <div className="text-text-muted text-sm">
                  — Our founding principle
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary to-deep-blue rounded-2xl p-8 lg:p-12 text-white"
            >
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <FiTarget className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed opacity-90">
                To bridge the gap between academic learning and industry expectations through 
                structured, company-owned internship programs that deliver real skills and real results.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-accent-blue to-primary rounded-2xl p-8 lg:p-12 text-white"
            >
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <FiEye className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-lg leading-relaxed opacity-90">
                To become India's most trusted internship platform — where every student gets 
                a fair, transparent opportunity to launch their professional career.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-deep-blue mb-4">
              Our Core Values
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at Herrico
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 ${value.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className={`w-8 h-8 ${value.color}`} />
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-3">
                  {value.title}
                </h3>
                <p className="text-base text-text-muted leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
