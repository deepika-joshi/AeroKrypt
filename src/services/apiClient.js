/**
 * AEROKRYPT - Full-Stack Planetary Science API Client
 *
 * Handles authenticated communication with the FastAPI backend.
 * Uses credentials: 'include' for secure HttpOnly cookie session management.
 * Provides resilient fallbacks when backend is offline or starting up.
 */

const API_BASE = '/api/v1'

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  }

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body)
  }

  try {
    const res = await fetch(url, config)
    const isJson = res.headers.get('content-type')?.includes('application/json')
    const data = isJson ? await res.json() : await res.text()

    if (!res.ok) {
      const errorMsg = (typeof data === 'object' && data?.detail)
        ? data.detail
        : `Request failed with status ${res.status}`
      return { success: false, status: res.status, error: errorMsg, data: null }
    }

    return { success: true, status: res.status, data, error: null }
  } catch (err) {
    // Network failure / server offline
    return {
      success: false,
      status: 0,
      error: err.message || 'Network connection failed. Backend service may be offline.',
      data: null,
      isNetworkError: true,
    }
  }
}

export const authApi = {
  async register({ email, password, full_name, institution, role = 'RESEARCHER' }) {
    return request('/auth/register', {
      method: 'POST',
      body: { email, password, full_name, institution, role },
    })
  },

  async login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
  },

  async logout() {
    return request('/auth/logout', { method: 'POST' })
  },

  async getMe() {
    return request('/auth/me', { method: 'GET' })
  },
}

export const researchApi = {
  async getMyRecords(params = {}) {
    const query = new URLSearchParams()
    if (params.status) query.set('status', params.status)
    if (params.target_body) query.set('target_body', params.target_body)
    if (params.category) query.set('category', params.category)
    if (params.search) query.set('search', params.search)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return request(`/research/records${qs}`, { method: 'GET' })
  },

  async createRecord(recordData) {
    return request('/research/records', {
      method: 'POST',
      body: recordData,
    })
  },

  async getRecord(recordId) {
    return request(`/research/records/${recordId}`, { method: 'GET' })
  },

  async updateRecord(recordId, updateData) {
    return request(`/research/records/${recordId}`, {
      method: 'PUT',
      body: updateData,
    })
  },

  async deleteRecord(recordId) {
    return request(`/research/records/${recordId}`, { method: 'DELETE' })
  },

  async submitRecord(recordId) {
    return request(`/research/records/${recordId}/submit`, { method: 'POST' })
  },

  async getReviewQueue(statusFilter = null) {
    const qs = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : ''
    return request(`/research/submissions/queue${qs}`, { method: 'GET' })
  },

  async reviewSubmission(submissionId, { status, reviewer_comments, reviewer_name }) {
    return request(`/research/submissions/${submissionId}/review`, {
      method: 'POST',
      body: { status, reviewer_comments, reviewer_name },
    })
  },

  async publishSubmission(submissionId) {
    return request(`/research/submissions/${submissionId}/publish`, { method: 'POST' })
  },

  async getPublicPublished(params = {}) {
    const query = new URLSearchParams()
    if (params.target_body) query.set('target_body', params.target_body)
    if (params.category) query.set('category', params.category)
    if (params.search) query.set('search', params.search)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return request(`/research/public/published${qs}`, { method: 'GET' })
  },

  async getRecordAuditTrail(recordId) {
    return request(`/research/records/${recordId}/audit-trail`, { method: 'GET' })
  },

  // Research Project Management Endpoints
  async getProjects(params = {}) {
    const query = new URLSearchParams()
    if (params.status) query.set('status', params.status)
    if (params.target_body) query.set('target_body', params.target_body)
    if (params.category) query.set('category', params.category)
    if (params.search) query.set('search', params.search)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return request(`/research/projects${qs}`, { method: 'GET' })
  },

  async createProject(projectData) {
    return request('/research/projects', {
      method: 'POST',
      body: projectData,
    })
  },

  async getProject(projectId) {
    return request(`/research/projects/${projectId}`, { method: 'GET' })
  },

  async updateProject(projectId, updateData) {
    return request(`/research/projects/${projectId}`, {
      method: 'PUT',
      body: updateData,
    })
  },

  async deleteProject(projectId) {
    return request(`/research/projects/${projectId}`, { method: 'DELETE' })
  },
}

export const locationsApi = {
  async getLocations(targetBody = null, category = null) {
    const query = new URLSearchParams()
    if (targetBody) query.set('target_body', targetBody)
    if (category) query.set('category', category)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return request(`/locations${qs}`, { method: 'GET' })
  },

  async getLocationById(locationId) {
    return request(`/locations/${locationId}`, { method: 'GET' })
  },

  async getLocationGeoJson(locationId) {
    return request(`/locations/${locationId}/geojson`, { method: 'GET' })
  },
}

export const evaluationsApi = {
  async getSiteAssessment({
    location_id,
    target_body,
    planetary_terrain_id,
    experiment_id = null,
    evaluator_name = 'Principal Investigator',
    project_id = null,
    save_to_project = false,
  }) {
    return request('/evaluations/site-assessment', {
      method: 'POST',
      body: {
        location_id,
        target_body,
        planetary_terrain_id,
        experiment_id,
        evaluator_name,
        project_id,
        save_to_project,
      },
    })
  },

  async getEvaluationById(evaluationId) {
    return request(`/evaluations/${evaluationId}`, { method: 'GET' })
  },

  async getProjectEvaluations(projectId) {
    return request(`/evaluations/project/${projectId}`, { method: 'GET' })
  },

  async compareEvaluations(evaluationIds) {
    return request('/evaluations/compare', {
      method: 'POST',
      body: { evaluation_ids: evaluationIds },
    })
  },

  async predictHazards(features) {
    return request('/evaluations/predict-hazards', {
      method: 'POST',
      body: features,
    })
  },
}

export const planetaryApi = {
  async getTerrains(targetBody = null) {
    const query = new URLSearchParams()
    if (targetBody) query.set('target_body', targetBody)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return request(`/planetary/terrains${qs}`, { method: 'GET' })
  },

  async getTerrainById(terrainId) {
    return request(`/planetary/terrains/${terrainId}`, { method: 'GET' })
  },

  async sampleElevation(lat, lon, body = 'Mars') {
    return request(`/planetary/elevation-sample?lat=${lat}&lon=${lon}&body=${body}`, { method: 'GET' })
  },
}

export const healthApi = {
  async checkHealth() {
    try {
      const res = await fetch('/health')
      if (res.ok) {
        return { success: true, data: await res.json() }
      }
      return { success: false, data: null }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },
}
