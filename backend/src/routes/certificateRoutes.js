import express from 'express'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'
import Application from '../models/Application.js'
import { apiKeyAuth } from '../middleware/apiKeyAuth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

router.use(apiKeyAuth)

const generateCertificateId = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `UPST-${timestamp}-${random}`
}

const certificatesDir = path.join(__dirname, '../../certificates')

if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true })
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

router.post('/generate', async (req, res) => {
  try {
    const { applicationId } = req.body

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: 'applicationId is required'
      })
    }

    const application = await Application.findById(applicationId)
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    if (application.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Certificate can only be generated for completed internships'
      })
    }

    const certificateId = generateCertificateId()
    const fileName = `certificate_${applicationId}_${Date.now()}.pdf`
    const filePath = path.join(certificatesDir, fileName)

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 50
    })

    const stream = fs.createWriteStream(filePath)
    doc.pipe(stream)

    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3)
      .stroke('#0D47A1')

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .lineWidth(1)
      .stroke('#1A73E8')

    doc.moveDown(2)
    doc.fontSize(14)
      .fillColor('#1A73E8')
      .text('UPSTRIVE', { align: 'center' })

    doc.moveDown(0.5)
    doc.fontSize(10)
      .fillColor('#6B7280')
      .text('Company-Owned Internship Programs', { align: 'center' })

    doc.moveDown(2)
    doc.fontSize(36)
      .fillColor('#0D47A1')
      .font('Helvetica-Bold')
      .text('CERTIFICATE', { align: 'center' })

    doc.moveDown(0.5)
    doc.fontSize(16)
      .fillColor('#6B7280')
      .font('Helvetica')
      .text('OF COMPLETION', { align: 'center' })

    doc.moveDown(2)
    doc.fontSize(14)
      .fillColor('#6B7280')
      .text('This is to certify that', { align: 'center' })

    doc.moveDown(1)
    doc.fontSize(32)
      .fillColor('#1C1C2E')
      .font('Helvetica-Bold')
      .text(application.fullName, { align: 'center' })

    doc.moveDown(1)
    doc.fontSize(14)
      .fillColor('#6B7280')
      .font('Helvetica')
      .text('has successfully completed the', { align: 'center' })

    doc.moveDown(1)
    doc.fontSize(24)
      .fillColor('#1A73E8')
      .font('Helvetica-Bold')
      .text(application.program, { align: 'center' })

    doc.moveDown(1)
    doc.fontSize(14)
      .fillColor('#6B7280')
      .font('Helvetica')
      .text(`Duration: ${application.duration}`, { align: 'center' })

    doc.moveDown(2)
    const completionDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    doc.fontSize(12)
      .fillColor('#6B7280')
      .text(`Date: ${completionDate}`, { align: 'center' })

    doc.moveDown(1)
    doc.fontSize(12)
      .fillColor('#1C1C2E')
      .text(`Certificate ID: ${certificateId}`, { align: 'center' })

    doc.moveDown(2)
    doc.fontSize(10)
      .fillColor('#6B7280')

    const leftX = 150
    const rightX = doc.page.width - 150
    const lineY = doc.page.height - 100

    doc.text('_____________________', leftX, lineY, { align: 'center' })
    doc.text('Authorized Signature', leftX, lineY + 15, { align: 'center' })

    doc.text('_____________________', rightX, lineY, { align: 'center' })
    doc.text('Director, Upstrive', rightX, lineY + 15, { align: 'center' })

    doc.end()

    await new Promise((resolve, reject) => {
      stream.on('finish', resolve)
      stream.on('error', reject)
    })

    const cloudinaryResult = await cloudinary.uploader.upload(filePath, {
      folder: 'upstrive-certificates',
      public_id: fileName.replace('.pdf', ''),
      resource_type: 'raw'
    })

    application.certificateUrl = cloudinaryResult.secure_url
    application.certificateId = certificateId
    await application.save()

    fs.unlinkSync(filePath)

    res.json({
      success: true,
      certificateUrl: cloudinaryResult.secure_url
    })
  } catch (error) {
    console.error('Error generating certificate:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate certificate'
    })
  }
})

router.get('/verify/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params

    const application = await Application.findOne({ certificateId })

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      })
    }

    res.json({
      success: true,
      data: {
        certificateId: application.certificateId,
        studentName: application.fullName,
        program: application.program,
        duration: application.duration,
        certificateUrl: application.certificateUrl,
        isValid: true
      }
    })
  } catch (error) {
    console.error('Error verifying certificate:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to verify certificate'
    })
  }
})

export default router
