const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function fetchInternships() {
  const res = await fetch(`${API_BASE_URL}/internships`)
  return res.json()
}

export async function fetchInternship(id) {
  const res = await fetch(`${API_BASE_URL}/internships/${id}`)
  return res.json()
}

export async function submitApplication(data) {
  const res = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function submitContact(data) {
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function subscribeNewsletter(email) {
  const res = await fetch(`${API_BASE_URL}/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  return res.json()
}
