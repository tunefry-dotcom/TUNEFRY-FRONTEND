import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, logout as apiLogout } from '../lib/auth'

const AuthContext = createContext(null)

// user === undefined  →  still loading (splash / checking cookie)
// user === null       →  confirmed logged out
// user === { id, email, role }  →  logged in

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  const logout = async () => {
    await apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading: user === undefined }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
