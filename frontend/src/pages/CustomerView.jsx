import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { customerService } from '../services/api'

function CustomerView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await customerService.getOne(id)
        setCustomer(response.data.data)
      } catch (err) {
        setError('Customer not found.')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return
    try {
      await customerService.delete(id)
      navigate('/customers')
    } catch (err) {
      setError('Failed to delete customer.')
    }
  }

  if (loading) {
    return <div className="container mt-4 text-center">Loading...</div>
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/customers" className="btn btn-secondary">
          Back to List
        </Link>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Customer Details</h4>
              <Link to="/customers" className="btn btn-sm btn-secondary">
                Back to List
              </Link>
            </div>
            <div className="card-body">

              <div className="mb-3">
                <label className="fw-bold">Full Name</label>
                <p className="form-control-plaintext">{customer.full_name}</p>
              </div>

              <div className="mb-3">
                <label className="fw-bold">Email Address</label>
                <p className="form-control-plaintext">{customer.email}</p>
              </div>

              <div className="mb-3">
                <label className="fw-bold">Contact Number</label>
                <p className="form-control-plaintext">{customer.contact_number}</p>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <Link
                  to={`/customers/${customer.id}/edit`}
                  className="btn btn-warning"
                >
                  Edit
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerView