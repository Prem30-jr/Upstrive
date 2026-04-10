import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import internshipRoutes from './routes/internshipRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import emailRoutes from './routes/emailRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import certificateRoutes from './routes/certificateRoutes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/internships', internshipRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/contact', contactRoutes)

app.use('/api/admin', adminRoutes)
app.use('/api/email', emailRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/certificate', certificateRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Upstrive API is running' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/upstrive'
const PORT = process.env.PORT || 5000

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  })

export default app
