import { Routes, Route, Navigate } from 'react-router-dom'
import useStore from './store/useStore.js'
import { ADMIN_EMAILS } from './config/admin.js'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import Order from './pages/Order.jsx'
import Detalle from "./pages/Details.jsx"
import Success from './pages/SuccessPage.jsx'
import Checkout from './pages/CheckoutPage.jsx'
import AdminDashboard from './components/Admin/AdminDashboard.jsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx'

function AdminRoute({ children }) {
  const user = useStore((s) => s.user)
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/order" element={<Order />} />
        <Route path="/product/:id" element={<Detalle />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
