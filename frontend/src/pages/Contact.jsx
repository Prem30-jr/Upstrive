import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiMail, FiPhone, FiSend, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiCheckCircle } from 'react-icons/fi'
import toast, { Toaster } from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message')
      }

      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error(error.message || 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      toast.error('Please enter a valid email')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe')
      }

      setIsSubscribed(true)
      toast.success('Subscribed to newsletter!')
      setNewsletterEmail('')
    } catch (error) {
      toast.error(error.message || 'Failed to subscribe. Please try again.')
    }
  }

  const contactInfo = [
    {
      icon: FiMapPin,
      title: 'Our Location',
      details: ['123 Tech Park, Sector 62', 'Noida, UP 201301, India'],
      color: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    {
      icon: FiMail,
      title: 'Email Us',
      details: ['hello@upstrive.com', 'support@upstrive.com'],
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      icon: FiPhone,
      title: 'Call Us',
      details: ['+91 98765 43210', '+91 98765 43211'],
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    }
  ]

  const socialLinks = [
    { icon: FiFacebook, url: '#', color: 'hover:text-blue-600', bgColor: 'hover:bg-blue-50' },
    { icon: FiTwitter, url: '#', color: 'hover:text-sky-500', bgColor: 'hover:bg-sky-50' },
    { icon: FiInstagram, url: '#', color: 'hover:text-pink-600', bgColor: 'hover:bg-pink-50' },
    { icon: FiLinkedin, url: '#', color: 'hover:text-blue-700', bgColor: 'hover:bg-blue-50' }
  ]

  return (
    <div className="pt-20">
      <Toaster position="top-right" />
      
      <section className="relative py-20 lg:py-32 bg-deep-blue overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
            alt="Contact Background"
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
              Get in Touch with Us
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-light-bg rounded-3xl p-8 lg:p-12">
                <h2 className="text-2xl font-bold text-deep-blue mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="Enter subject"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                      placeholder="Write your message here..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-deep-blue hover:shadow-lg hover:shadow-primary/30'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-light-bg rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${info.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <info.icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-text-dark mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm text-text-muted">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-light-bg rounded-2xl p-6">
                <h3 className="font-bold text-text-dark mb-4">Follow Us</h3>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className={`w-10 h-10 bg-white rounded-full flex items-center justify-center border border-border-color transition-all duration-300 ${social.color} ${social.bgColor}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-deep-blue rounded-2xl p-6 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Visit Our Office</h3>
                <p className="text-gray-200 mb-4">
                  Monday - Friday: 9:00 AM - 6:00 PM
                </p>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80"
                    alt="Office Location"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-light-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-deep-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <FiMail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-deep-blue mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-base text-text-muted leading-relaxed mb-8 max-w-xl mx-auto">
              Get the latest updates on new programs, career tips, and industry insights delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 border border-border-color rounded-full focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-primary to-deep-blue text-white font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isSubscribed ? (
                  <>
                    <FiCheckCircle className="w-5 h-5" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <FiSend className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
