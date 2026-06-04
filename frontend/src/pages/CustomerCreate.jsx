import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { customerService } from '../services/api'

function CustomerCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await customerService.create(form)
      navigate('/customers')
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>Add Customer</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                    value={form.first_name}
                    onChange={handleChange}
                  />
                  {errors.first_name && (
                    <div className="invalid-feedback">{errors.first_name[0]}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                    value={form.last_name}
                    onChange={handleChange}
                  />
                  {errors.last_name && (
                    <div className="invalid-feedback">{errors.last_name[0]}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email[0]}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="text"
                    name="contact_number"
                    className={`form-control ${errors.contact_number ? 'is-invalid' : ''}`}
                    value={form.contact_number}
                    onChange={handleChange}
                  />
                  {errors.contact_number && (
                    <div className="invalid-feedback">{errors.contact_number[0]}</div>
                  )}
                </div>

                <div className="d-flex justify-content-between">
                  <Link to="/customers" className="btn btn-secondary">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Customer'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerCreate