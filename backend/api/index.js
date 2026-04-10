import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import PDFDocument from 'pdfkit'
import cloudinary from 'cloudinary'
import Application from './models/Application.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const VALID_STATUSES = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Accepted', 'Payment Pending', 'Payment Done', 'Active', 'Completed', 'Rejected']

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }
  next()
}

// Admin Routes
app.get('/api/admin', apiKeyAuth, async (req, res) => {
  try {
    const { status, program, date } = req.query
    const filter = {}
    if (status) filter.status = status
    if (program) filter.program = { $regex: program, $options: 'i' }
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      filter.appliedAt = { $gte: startDate, $lt: endDate }
    }
    const applications = await Application.find(filter).populate('internshipId', 'title domain').sort({ appliedAt: -1 })
    res.json({ success: true, count: applications.length, data: applications })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

app.get('/api/admin/:id', apiKeyAuth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('internshipId', 'title domain duration stipend skillsRequired')
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })
    res.json({ success: true, data: application })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

app.patch('/api/admin/:id/status', apiKeyAuth, async (req, res) => {
  try {
    const { status } = req.body
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }
    const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })
    res.json({ success: true, message: 'Status updated successfully', data: application })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

app.get('/api/admin/stats/summary', apiKeyAuth, async (req, res) => {
  try {
    const total = await Application.countDocuments()
    const statusCounts = await Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    const stats = { total, applied: 0, shortlisted: 0, interview: 0, selected: 0, accepted: 0, paymentPending: 0, paymentDone: 0, active: 0, completed: 0, rejected: 0 }
    statusCounts.forEach(item => {
      const key = item._id.replace(/\s+/g, '').toLowerCase()
      if (key in stats) stats[key] = item.count
    })
    res.json({ success: true, data: stats })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Email Routes
const emailTemplates = {
  'offer-letter': (d) => ({ subject: 'Congratulations! Your Upstrive Internship Offer', html: `<h2>Congratulations ${d.fullName}!</h2><p>Program: ${d.program}</p><p>Duration: ${d.duration}</p><p>Next Step: Complete payment to confirm your seat.</p>` }),
  'payment-link': (d) => ({ subject: 'Complete Your Payment — Upstrive Internship', html: `<h2>Payment Required</h2><p>Amount: ₹${d.amount || 2999}</p><p>Program: ${d.program}</p><a href="${d.paymentLink}">Pay Now</a>` }),
  'payment-confirmation': (d) => ({ subject: 'Payment Received — You\'re In!', html: `<h2>Payment Confirmed!</h2><p>Dear ${d.fullName}, Welcome to Upstrive!</p>` }),
  'welcome': (d) => ({ subject: 'Welcome to Upstrive! Your Internship Begins', html: `<h2>Welcome Aboard!</h2><p>Program: ${d.program}</p><p>Mentor: ${d.mentor || 'Assigned shortly'}</p>` }),
  'certificate': (d) => ({ subject: 'Your Upstrive Certificate is Ready!', html: `<h2>Congratulations, ${d.fullName}!</h2><p>Certificate ID: ${d.certificateId}</p><a href="${d.certificateUrl}">Download Certificate</a>` })
}

app.post('/api/email/send-email', apiKeyAuth, async (req, res) => {
  try {
    const { applicationId, type, ...extraData } = req.body
    if (!applicationId || !type) return res.status(400).json({ success: false, message: 'applicationId and type required' })
    const app = await Application.findById(applicationId)
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' })
    const template = emailTemplates[type]?.({ fullName: app.fullName, program: app.program, duration: app.duration, ...extraData })
    if (!template) return res.status(400).json({ success: false, message: 'Invalid email type' })
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } })
    await transporter.sendMail({ from: `"Upstrive" <${process.env.EMAIL_USER}>`, to: app.email, subject: template.subject, html: template.html })
    res.json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Payment Routes
app.post('/api/payment/create', apiKeyAuth, async (req, res) => {
  try {
    const { applicationId, amount } = req.body
    if (!applicationId || !amount) return res.status(400).json({ success: false, message: 'applicationId and amount required' })
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
    const order = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: 'INR', receipt: `receipt_${applicationId}` })
    await Application.findByIdAndUpdate(applicationId, { razorpayOrderId: order.id })
    res.json({ success: true, orderId: order.id, amount, currency: 'INR', paymentLink: `https://rzp.io/i/${order.id}` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

app.post('/api/payment/verify', apiKeyAuth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex')
    if (generatedSignature !== razorpay_signature) return res.status(400).json({ success: false, message: 'Payment verification failed' })
    const application = await Application.findOne({ razorpayOrderId: razorpay_order_id })
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })
    application.status = 'Payment Done'
    await application.save()
    res.json({ success: true, message: 'Payment verified successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Certificate Route
app.post('/api/certificate/generate', apiKeyAuth, async (req, res) => {
  try {
    const { applicationId } = req.body
    if (!applicationId) return res.status(400).json({ success: false, message: 'applicationId required' })
    const application = await Application.findById(applicationId)
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })
    if (application.status !== 'Completed') return res.status(400).json({ success: false, message: 'Certificate only for completed internships' })
    const certId = `UPST-${Date.now().toString(36).toUpperCase()}`
    application.certificateId = certId
    application.certificateUrl = `https://upstrive.com/certificates/${certId}`
    await application.save()
    res.json({ success: true, certificateUrl: application.certificateUrl })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default app
