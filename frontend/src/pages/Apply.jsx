import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiMapPin, FiFileText, FiSend, FiCheckCircle, FiAlertCircle, FiUpload } from 'react-icons/fi'
import toast, { Toaster } from 'react-hot-toast'

const Apply = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    program: id || '',
    duration: '',
    college: '',
    graduationYear: '',
    motivation: '',
  })

  const [resumeFile, setResumeFile] = useState(null)
  const [resumePreview, setResumePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const programs = [
    'AI & Machine Learning',
    'MERN Stack Development',
    'Data Science & Analytics',
    'Cloud Computing',
    'Cyber Security',
    'UI/UX Design',
    'Android Development',
    'C++ Programming',
    'Java Development',
    'Python Programming',
    'Digital Marketing'
  ]

  const durations = ['4 weeks', '8 weeks', '12 weeks']
  const years = ['2024', '2025', '2026', '2027', '2028']

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return value.length < 3 ? 'Name must be at least 3 characters' : ''
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : ''
      case 'phone':
        return !/^[6-9]\d{9}$/.test(value.replace(/\D/g, '')) ? 'Invalid phone number' : ''
      case 'program':
        return !value ? 'Please select a program' : ''
      case 'duration':
        return !value ? 'Please select a duration' : ''
      case 'college':
        return value.length < 3 ? 'Please enter a valid college name' : ''
      case 'graduationYear':
        return !value ? 'Please select graduation year' : ''
      case 'motivation':
        return value.length < 50 ? 'Motivation must be at least 50 characters' : ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    const error = validateField(name, value)
    setErrors({ ...errors, [name]: error })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, resume: 'File size must be less than 5MB' })
        setResumeFile(null)
        setResumePreview(null)
        return
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setErrors({ ...errors, resume: 'Only PDF and DOC files are allowed' })
        setResumeFile(null)
        setResumePreview(null)
        return
      }
      setResumeFile(file)
      setResumePreview(file.name)
      setErrors({ ...errors, resume: '' })
    }
  }

  const uploadResume = async (file) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    
    const reader = new FileReader()
    
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64 = reader.result.split(',')[1]
          
          const response = await fetch(`${API_URL}/api/upload/resume`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileBase64: base64,
              fileName: file.name,
              mimeType: file.type
            })
          })
          
          const data = await response.json()
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to upload resume')
          }
          
          resolve(data.url)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })

    if (!resumeFile) {
      newErrors.resume = 'Resume is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setIsUploading(true)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      toast.loading('Uploading resume...', { id: 'upload' })
      const resumeUrl = await uploadResume(resumeFile)
      toast.success('Resume uploaded!', { id: 'upload' })
      setIsUploading(false)
      
      toast.loading('Submitting application...', { id: 'submit' })
      
      const response = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          program: formData.program,
          duration: formData.duration,
          college: formData.college,
          graduationYear: formData.graduationYear,
          motivation: formData.motivation,
          resumeUrl: resumeUrl
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application')
      }

      toast.success('Application submitted successfully!', { id: 'submit' })
      setShowSuccess(true)
    } catch (error) {
      toast.dismiss('upload')
      toast.dismiss('submit')
      toast.error(error.message || 'Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
      setIsUploading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="pt-20 min-h-screen bg-light-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto px-4 text-center"
        >
          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-deep-blue mb-4">
              Application Submitted!
            </h2>
            <p className="text-base text-text-muted leading-relaxed mb-8 max-w-lg mx-auto">
              Thank you for applying to Clarix. We've received your application and will 
              review it shortly. Here's what happens next:
            </p>
            <div className="space-y-4 text-left mb-8">
              {[
                { step: 1, title: 'Application Review', desc: 'Our team will review your application' },
                { step: 2, title: 'Shortlisting', desc: 'Qualified candidates will be shortlisted' },
                { step: 3, title: 'Interview', desc: 'Technical and HR interview round' },
                { step: 4, title: 'Offer', desc: 'Selected candidates receive offer letter' }
              ].map((item) => (
                <div key={item.step} className="flex items-center space-x-4 p-4 bg-light-bg rounded-xl">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  <div>
                    <div className="font-semibold text-text-dark">{item.title}</div>
                    <div className="text-sm text-text-muted">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-light-bg">
      <Toaster position="top-right" />
      
      <section className="relative py-16 bg-gradient-to-br from-deep-blue via-primary to-deep-blue">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80"
            alt="Apply Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Apply for Internship
            </h1>
            <p className="text-xl text-gray-300">
              Take the first step towards your dream career
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                        errors.fullName ? 'border-red-500' : 'border-border-color'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                        errors.email ? 'border-red-500' : 'border-border-color'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                        errors.phone ? 'border-red-500' : 'border-border-color'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Program / Domain *
                  </label>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                      errors.program ? 'border-red-500' : 'border-border-color'
                    }`}
                  >
                    <option value="">Select a program</option>
                    {programs.map((prog) => (
                      <option key={prog} value={prog}>
                        {prog}
                      </option>
                    ))}
                  </select>
                  {errors.program && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.program}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Internship Duration *
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                      errors.duration ? 'border-red-500' : 'border-border-color'
                    }`}
                  >
                    <option value="">Select duration</option>
                    {durations.map((dur) => (
                      <option key={dur} value={dur}>
                        {dur}
                      </option>
                    ))}
                  </select>
                  {errors.duration && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.duration}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Graduation Year *
                  </label>
                  <select
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                      errors.graduationYear ? 'border-red-500' : 'border-border-color'
                    }`}
                  >
                    <option value="">Select year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.graduationYear && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.graduationYear}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  College / University *
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                      errors.college ? 'border-red-500' : 'border-border-color'
                    }`}
                    placeholder="Enter your college/university name"
                  />
                </div>
                {errors.college && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    {errors.college}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Why do you want to join this program? *
                  <span className="text-text-muted font-normal ml-2">
                    (min. 50 characters)
                  </span>
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none ${
                    errors.motivation ? 'border-red-500' : 'border-border-color'
                  }`}
                  placeholder="Tell us about your interest in this program and your career goals..."
                />
                <div className="flex justify-between mt-1">
                  {errors.motivation && (
                    <p className="text-red-500 text-sm flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.motivation}
                    </p>
                  )}
                  <span className="text-text-muted text-sm ml-auto">
                    {formData.motivation.length}/50
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Upload Resume *
                  <span className="text-red-500 ml-1">(Required)</span>
                  <span className="text-text-muted font-normal ml-2">
                    (PDF/DOC, max 5MB)
                  </span>
                </label>
                <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                  errors.resume ? 'border-red-500 bg-red-50' : 
                  resumeFile ? 'border-green-500 bg-green-50' : 
                  'border-border-color hover:border-primary'
                }`}>
                  <div className="flex flex-col items-center justify-center relative z-10">
                    {resumeFile ? (
                      <div className="text-center">
                        <FiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <p className="font-medium text-text-dark">{resumePreview}</p>
                        <p className="text-sm text-green-600 mt-1">Resume uploaded</p>
                        <button
                          type="button"
                          onClick={() => {
                            setResumeFile(null)
                            setResumePreview(null)
                          }}
                          className="text-sm text-red-500 mt-2 hover:underline"
                        >
                          Remove and upload different file
                        </button>
                      </div>
                    ) : (
                      <>
                        <FiUpload className="w-12 h-12 text-text-muted mb-3" />
                        <p className="text-text-muted mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-text-muted">PDF or DOC up to 5MB</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                      </>
                    )}
                  </div>
                </div>
                {errors.resume && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    {errors.resume}
                  </p>
                )}
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
                    <span>{isUploading ? 'Uploading Resume...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    <FiSend className="w-5 h-5" />
                    <span>Submit Application</span>
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

export default Apply
