import express from 'express'
import Application from '../models/Application.js'
import { apiKeyAuth } from '../middleware/apiKeyAuth.js'

const router = express.Router()

router.use(apiKeyAuth)

const VALID_STATUSES = [
  'Applied', 'Shortlisted', 'Interview', 'Selected', 
  'Accepted', 'Payment Pending', 'Payment Done', 
  'Active', 'Completed', 'Rejected'
]

router.get('/', async (req, res) => {
  try {
    const { status, program, date } = req.query
    const filter = {}

    if (status) {
      filter.status = status
    }

    if (program) {
      filter.program = { $regex: program, $options: 'i' }
    }

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      filter.appliedAt = { $gte: startDate, $lt: endDate }
    }

    const applications = await Application.find(filter)
      .populate('internshipId', 'title domain')
      .sort({ appliedAt: -1 })

    res.json({
      success: true,
      count: applications.length,
      data: applications
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('internshipId', 'title domain duration stipend skillsRequired')

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    res.json({
      success: true,
      data: application
    })
  } catch (error) {
    console.error('Error fetching application:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application'
    })
  }
})

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const { id } = req.params

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      })
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      })
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('internshipId', 'title domain')

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: application
    })
  } catch (error) {
    console.error('Error updating status:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating status'
    })
  }
})

router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Application.countDocuments()
    
    const statusCounts = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    const stats = {
      total,
      applied: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      accepted: 0,
      paymentPending: 0,
      paymentDone: 0,
      active: 0,
      completed: 0,
      rejected: 0
    }

    statusCounts.forEach(item => {
      const statusKey = item._id.replace(/\s+/g, '').toLowerCase()
      if (statusKey in stats) {
        stats[statusKey] = item.count
      }
    })

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats'
    })
  }
})

export default router
