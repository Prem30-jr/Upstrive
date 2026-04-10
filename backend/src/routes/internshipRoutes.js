import express from 'express'
import Internship from '../models/Internship.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find({ isActive: true }).sort({ createdAt: -1 })
    res.json(internships)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' })
    }
    res.json(internship)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const internship = new Internship(req.body)
    const savedInternship = await internship.save()
    res.status(201).json(savedInternship)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
