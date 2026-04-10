import express from 'express'
import nodemailer from 'nodemailer'
import Application from '../models/Application.js'
import { apiKeyAuth } from '../middleware/apiKeyAuth.js'

const router = express.Router()

router.use(apiKeyAuth)

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

const emailTemplates = {
  'offer-letter': (data) => ({
    subject: 'Congratulations! Your Upstrive Internship Offer',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0D47A1; margin: 0;">Upstrive</h1>
        </div>
        <h2 style="color: #1A73E8;">Congratulations ${data.fullName}!</h2>
        <p>We're thrilled to offer you an internship position at Upstrive!</p>
        <div style="background-color: #F4F8FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Program:</strong> ${data.program}</p>
          <p><strong>Duration:</strong> ${data.duration}</p>
        </div>
        <p><strong>Next Step:</strong> Please complete the payment to confirm your seat. You'll receive a payment link shortly.</p>
        <p>If you have any questions, feel free to reach out to us at hello@upstrive.com</p>
        <p>Best regards,<br>The Upstrive Team</p>
      </div>
    `
  }),

  'payment-link': (data) => ({
    subject: 'Complete Your Payment — Upstrive Internship',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0D47A1; margin: 0;">Upstrive</h1>
        </div>
        <h2 style="color: #1A73E8;">Payment Required</h2>
        <p>Dear ${data.fullName},</p>
        <div style="background-color: #F4F8FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Amount:</strong> ₹${data.amount || 2999}</p>
          <p><strong>Program:</strong> ${data.program}</p>
        </div>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${data.paymentLink || '#'}" style="background-color: #1A73E8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Pay Now</a>
        </p>
        <p><strong>Note:</strong> Please complete the payment within 7 days to confirm your seat.</p>
        <p>Best regards,<br>The Upstrive Team</p>
      </div>
    `
  }),

  'payment-confirmation': (data) => ({
    subject: 'Payment Received — You\'re In!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0D47A1; margin: 0;">Upstrive</h1>
        </div>
        <h2 style="color: #16A34A;">Payment Confirmed!</h2>
        <p>Dear ${data.fullName},</p>
        <p>We have received your payment. Welcome to the Upstrive family!</p>
        <div style="background-color: #F4F8FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Program:</strong> ${data.program}</p>
          <p><strong>Duration:</strong> ${data.duration}</p>
          <p><strong>Start Date:</strong> ${data.startDate || 'To be announced'}</p>
        </div>
        <p>You will receive onboarding details shortly. Stay tuned!</p>
        <p>Best regards,<br>The Upstrive Team</p>
      </div>
    `
  }),

  'welcome': (data) => ({
    subject: 'Welcome to Upstrive! Your Internship Begins',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0D47A1; margin: 0;">Upstrive</h1>
        </div>
        <h2 style="color: #1A73E8;">Welcome Aboard!</h2>
        <p>Dear ${data.fullName},</p>
        <p>Congratulations on starting your internship with Upstrive!</p>
        <div style="background-color: #F4F8FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Program:</strong> ${data.program}</p>
          <p><strong>Mentor:</strong> ${data.mentor || 'Assigned shortly'}</p>
          <p><strong>Resources:</strong> <a href="https://upstrive.com/resources">Access Portal</a></p>
        </div>
        <p>Check your student portal for project details and schedule.</p>
        <p>Best regards,<br>The Upstrive Team</p>
      </div>
    `
  }),

  'certificate': (data) => ({
    subject: 'Your Upstrive Certificate is Ready!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0D47A1; margin: 0;">Upstrive</h1>
        </div>
        <h2 style="color: #1A73E8;">Congratulations, ${data.fullName}!</h2>
        <p>You have successfully completed your internship with Upstrive.</p>
        <div style="background-color: #F4F8FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Program:</strong> ${data.program}</p>
          <p><strong>Certificate ID:</strong> ${data.certificateId || 'N/A'}</p>
        </div>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${data.certificateUrl || '#'}" style="background-color: #1A73E8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Download Certificate</a>
        </p>
        <p>You can share your certificate on LinkedIn and add it to your portfolio!</p>
        <p>Best regards,<br>The Upstrive Team</p>
      </div>
    `
  })
}

router.post('/send-email', async (req, res) => {
  try {
    const { applicationId, type } = req.body

    if (!applicationId || !type) {
      return res.status(400).json({
        success: false,
        message: 'applicationId and type are required'
      })
    }

    const validTypes = Object.keys(emailTemplates)
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid email type. Must be one of: ${validTypes.join(', ')}`
      })
    }

    const application = await Application.findById(applicationId)
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    const template = emailTemplates[type]({
      fullName: application.fullName,
      program: application.program,
      duration: application.duration,
      ...req.body
    })

    const transporter = createTransporter()

    await transporter.sendMail({
      from: `"Upstrive" <${process.env.EMAIL_USER}>`,
      to: application.email,
      subject: template.subject,
      html: template.html
    })

    res.json({
      success: true,
      message: 'Email sent successfully'
    })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send email'
    })
  }
})

export default router
