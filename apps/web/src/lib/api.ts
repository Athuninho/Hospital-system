const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }))
    throw new Error(error.message || "Request failed")
  }

  return response.json()
}

export const patientsApi = {
  list: () => apiRequest("/patients"),
  get: (id: string) => apiRequest(`/patients/${id}`),
  create: (data: any) => apiRequest("/patients", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/patients/${id}`, { method: "PUT", body: JSON.stringify(data) }),
}
