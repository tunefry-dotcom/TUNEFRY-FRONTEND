import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#0C0C0C',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '2.5px solid rgba(255,255,255,0.08)',
          borderTopColor: '#FF6B00',
          animation: 'spin 0.75s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!user) return <Navigate to={location.pathname === '/' ? '/home' : '/login'} replace />

  return children
}
