import express from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import Application from '../models/Application.js'
import { apiKeyAuth } from '../middleware/apiKeyAuth.js'

const router = express.Router()

router.use(apiKeyAuth)

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

router.post('/create', async (req, res) => {
  try {
    const { applicationId, amount } = req.body

    if (!applicationId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'applicationId and amount are required'
      })
    }

    const application = await Application.findById(applicationId)
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    const amountInPaise = Math.round(amount * 100)

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${applicationId}_${Date.now()}`,
      notes: {
        applicationId,
        program: application.program
      }
    })

    await Application.findByIdAndUpdate(applicationId, {
      razorpayOrderId: order.id
    })

    const paymentLink = `https://rzp.io/i/${order.id}`

    res.json({
      success: true,
      orderId: order.id,
      amount: amount,
      currency: 'INR',
      paymentLink
    })
  } catch (error) {
    console.error('Error creating payment order:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'All payment details are required'
      })
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      })
    }

    const application = await Application.findOne({ razorpayOrderId: razorpay_order_id })
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found for this order'
      })
    }

    application.status = 'Payment Done'
    await application.save()

    try {
      const nodemailer = (await import('nodemailer')).default
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })

      await transporter.sendMail({
        from: `"Upstrive" <${process.env.EMAIL_USER}>`,
        to: application.email,
        subject: 'Payment Received — You\'re In!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #16A34A;">Payment Confirmed!</h2>
            <p>Dear ${application.fullName},</p>
            <p>We have received your payment. Welcome to the Upstrive family!</p>
            <p><strong>Program:</strong> ${application.program}</p>
            <p><strong>Duration:</strong> ${application.duration}</p>
            <p>You will receive onboarding details shortly.</p>
            <p>Best regards,<br>The Upstrive Team</p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
    }

    res.json({
      success: true,
      message: 'Payment verified successfully'
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    })
  }
})

export default router
