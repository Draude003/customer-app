import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { customerService } from '../services/api'

function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCustomers = async (query = '') => {
    setLoading(true)
    setError(null)
    try {
      const response = await customerService.getAll(query)
      setCustomers(response.data.data)
    } catch (err) {
      setError('Failed to fetch customers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchCustomers(search)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return
    try {
      await customerService.delete(id)
      fetchCustomers(search)
    } catch (err) {
      setError('Failed to delete customer.')
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Customers</h1>
        <Link to="/customers/create" className="btn btn-primary">
          Add Customer
        </Link>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-secondary">
            Search
          </button>
          {search && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => { setSearch(''); fetchCustomers('') }}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Loading */}
      {loading && <div className="text-center">Loading...</div>}

      {/* Table */}
      {!loading && (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer, index) => (
                <tr key={customer.id}>
                  <td>{index + 1}</td>
                  <td>{customer.full_name ?? `${customer.first_name} ${customer.last_name}`}</td>
                  <td>{customer.email}</td>
                  <td>{customer.contact_number}</td>
                  <td>
                    <Link
                      to={`/customers/${customer.id}`}
                      className="btn btn-sm btn-info me-1"
                    >
                      View
                    </Link>
                    <Link
                      to={`/customers/${customer.id}/edit`}
                      className="btn btn-sm btn-warning me-1"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default CustomerList