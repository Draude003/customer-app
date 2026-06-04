import { Routes, Route, Navigate } from 'react-router-dom'
import CustomerList from './pages/CustomerList'
import CustomerCreate from './pages/CustomerCreate'
import CustomerEdit from './pages/CustomerEdit'
import CustomerView from './pages/CustomerView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/customers" />} />
      <Route path="/customers" element={<CustomerList />} />
      <Route path="/customers/create" element={<CustomerCreate />} />
      <Route path="/customers/:id/edit" element={<CustomerEdit />} />
      <Route path="/customers/:id" element={<CustomerView />} />
    </Routes>
  )
}

export default App