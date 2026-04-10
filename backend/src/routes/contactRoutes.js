import express from 'express'
import { Contact, Newsletter } from '../models/Contact.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body)
    const savedContact = await contact.save()
    res.status(201).json(savedContact)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body
    
    const existingSubscriber = await Newsletter.findOne({ email })
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Email already subscribed' })
    }
    
    const newsletter = new Newsletter({ email })
    const savedNewsletter = await newsletter.save()
    res.status(201).json(savedNewsletter)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
