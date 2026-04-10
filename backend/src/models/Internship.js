import mongoose from 'mongoose'

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  duration: [{
    type: String
  }],
  stipend: {
    type: String,
    required: true
  },
  skillsRequired: [{
    type: String
  }],
  learningOutcomes: [{
    type: String
  }],
  imageUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

export default mongoose.model('Internship', internshipSchema)
