import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship'
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  graduationYear: {
    type: Number,
    required: true
  },
  resumeLink: {
    type: String
  },
  motivation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Accepted', 'Payment Pending', 'Payment Done', 'Active', 'Completed', 'Rejected'],
    default: 'Applied'
  },
  razorpayOrderId: {
    type: String
  },
  certificateUrl: {
    type: String
  },
  certificateId: {
    type: String
  }
}, { timestamps: true })

export default mongoose.model('Application', applicationSchema)
