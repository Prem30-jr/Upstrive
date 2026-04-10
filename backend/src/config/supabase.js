import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  console.error('SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING')
  console.error('SUPABASE_ANON_KEY:', supabaseKey ? 'SET' : 'MISSING')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export const BUCKET_NAME = 'resumes'

export async function uploadToStorage(fileBuffer, fileName, contentType) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(`${Date.now()}_${fileName}`, fileBuffer, {
      contentType,
      upsert: false
    })
  
  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }
  
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)
  
  return urlData.publicUrl
}

export async function uploadCertificate(certificateBuffer, certificateId) {
  const { data, error } = await supabase.storage
    .from('certificates')
    .upload(`certificates/${certificateId}.pdf`, certificateBuffer, {
      contentType: 'application/pdf',
      upsert: true
    })

  if (error) {
    throw new Error(`Certificate upload failed: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from('certificates')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}
