import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

export const customerService = {
  /**
   * Get all customers or search by query
   */
  getAll: (search = '') => {
    const params = search ? { search } : {}
    return api.get('/customers', { params })
  },

  /**
   * Get a single customer by ID
   */
  getOne: (id) => api.get(`/customers/${id}`),

  /**
   * Create a new customer
   */
  create: (data) => api.post('/customers', data),

  /**
   * Update an existing customer
   */
  update: (id, data) => api.put(`/customers/${id}`, data),

  /**
   * Delete a customer
   */
  delete: (id) => api.delete(`/customers/${id}`),
}