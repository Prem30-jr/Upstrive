import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { supabase } from './config/supabase.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

const VALID_STATUSES = [
  'Applied', 'Shortlisted', 'Interview', 'Selected',
  'Accepted', 'Active', 'Completed', 'Rejected'
]

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ===========================================
// INTERNSHIP ROUTES (Public)
// ===========================================
app.get('/api/internships', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('internships')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching internships:', error)
    res.status(500).json({ message: 'Failed to fetch internships' })
  }
})

app.get('/api/internships/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('internships')
      .select('*')
      .eq('id', req.params.id)
      .single()
    
    if (error) throw error
    if (!data) return res.status(404).json({ message: 'Internship not found' })
    res.json(data)
  } catch (error) {
    console.error('Error fetching internship:', error)
    res.status(500).json({ message: 'Failed to fetch internship' })
  }
})

// ===========================================
// RESUME UPLOAD ROUTE (Public)
// ===========================================
app.post('/api/upload/resume', async (req, res) => {
  try {
    const { fileBase64, fileName, mimeType } = req.body

    if (!fileBase64 || !fileName) {
      return res.status(400).json({ success: false, message: 'File data and name are required' })
    }

    const buffer = Buffer.from(fileBase64, 'base64')
    const uniqueFileName = `${Date.now()}_${fileName}`

    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(uniqueFileName, buffer, {
        contentType: mimeType || 'application/pdf',
        upsert: false
      })

    if (error) {
      console.error('Supabase storage error:', error)
      return res.status(500).json({ success: false, message: 'Failed to upload file: ' + error.message })
    }

    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(data.path)

    console.log('Resume uploaded:', urlData.publicUrl)
    res.json({ success: true, url: urlData.publicUrl, path: data.path })
  } catch (error) {
    console.error('Error uploading resume:', error)
    res.status(500).json({ success: false, message: 'Failed to upload resume: ' + error.message })
  }
})

// ===========================================
// APPLICATION ROUTES (Public)
// ===========================================
app.post('/api/applications', async (req, res) => {
  try {
    const { internshipId, fullName, email, phone, program, duration, college, graduationYear, motivation, resumeUrl } = req.body

    console.log('Received application data:', req.body)

    if (!fullName || !email || !phone || !program || !duration || !college || !graduationYear || !motivation) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    if (!resumeUrl) {
      return res.status(400).json({ success: false, message: 'Resume is required' })
    }

    const applicationData = {
      internship_id: internshipId || null,
      full_name: fullName,
      email,
      phone,
      program,
      duration,
      college,
      graduation_year: parseInt(graduationYear),
      motivation,
      resume_url: resumeUrl,
      status: 'Applied',
      applied_at: new Date().toISOString()
    }

    console.log('Inserting application:', applicationData)

    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ success: false, message: error.message })
    }

    console.log('Application created:', data)
    res.status(201).json({ success: true, data })
  } catch (error) {
    console.error('Error creating application:', error)
    res.status(500).json({ success: false, message: 'Failed to submit application: ' + error.message })
  }
})

// ===========================================
// CONTACT ROUTES (Public)
// ===========================================
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    console.log('Received contact data:', req.body)

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, subject, message }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ success: false, message: error.message })
    }

    console.log('Contact created:', data)
    res.status(201).json({ success: true, message: 'Message received' })
  } catch (error) {
    console.error('Error submitting contact:', error)
    res.status(500).json({ success: false, message: 'Failed to submit message: ' + error.message })
  }
})

app.get('/api/contact', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({ message: 'Failed to fetch contacts' })
  }
})

// ===========================================
// NEWSLETTER ROUTES (Public)
// ===========================================
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body

    console.log('Received newsletter subscription:', email)

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      if (error.code === '23505') {
        return res.status(400).json({ success: false, message: 'Already subscribed' })
      }
      return res.status(500).json({ success: false, message: error.message })
    }

    console.log('Newsletter subscription created:', data)
    res.status(201).json({ success: true, message: 'Subscribed successfully' })
  } catch (error) {
    console.error('Error subscribing:', error)
    res.status(500).json({ success: false, message: 'Failed to subscribe: ' + error.message })
  }
})

// ===========================================
// ADMIN ROUTES (Protected with API Key)
// ===========================================
const adminAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }
  next()
}

app.get('/api/admin/applications', adminAuth, async (req, res) => {
  try {
    const { status, program, date } = req.query
    let query = supabase
      .from('applications')
      .select('*, internships(title, domain)')
      .order('applied_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }
    if (program) {
      query = query.ilike('program', `%${program}%`)
    }
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      query = query.gte('applied_at', startDate.toISOString())
      query = query.lt('applied_at', endDate.toISOString())
    }

    const { data, error } = await query
    if (error) throw error
    res.json({ success: true, count: data?.length || 0, data })
  } catch (error) {
    console.error('Error fetching applications:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch applications' })
  }
})

app.get('/api/admin/applications/:id', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, internships(*)')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ success: false, message: 'Application not found' })
    res.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching application:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch application' })
  }
})

app.patch('/api/admin/applications/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` 
      })
    }

    const { data, error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ success: false, message: 'Application not found' })
    res.json({ success: true, message: 'Status updated successfully', data })
  } catch (error) {
    console.error('Error updating status:', error)
    res.status(500).json({ success: false, message: 'Failed to update status' })
  }
})

app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const { data: applications, error } = await supabase
      .from('applications')
      .select('status')

    if (error) throw error

    const stats = {
      total: applications?.length || 0,
      applied: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      accepted: 0,
      active: 0,
      completed: 0,
      rejected: 0
    }

    applications?.forEach(app => {
      const statusKey = app.status.replace(/\s+/g, '').toLowerCase()
      if (statusKey in stats) {
        stats[statusKey]++
      }
    })

    res.json({ success: true, data: stats })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch stats' })
  }
})

app.delete('/api/admin/applications/:id', adminAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ success: true, message: 'Application deleted' })
  } catch (error) {
    console.error('Error deleting application:', error)
    res.status(500).json({ success: false, message: 'Failed to delete application' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
