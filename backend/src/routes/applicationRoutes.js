import express from 'express'
import Application from '../models/Application.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 })
    res.json(applications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }
    res.json(application)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const application = new Application(req.body)
    const savedApplication = await application.save()
    res.status(201).json(savedApplication)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }
    res.json(application)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
