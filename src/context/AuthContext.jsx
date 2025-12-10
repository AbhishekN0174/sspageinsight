import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Load auth data from localStorage on mount
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('authUser')
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch (e) {
        console.error('Error loading auth data:', e)
        localStorage.removeItem('authToken')
        localStorage.removeItem('authUser')
      }
    }
  }, [])

  const login = (authData) => {
    const { token: authToken, user: userData } = authData
    setToken(authToken)
    setUser(userData)
    setIsAuthenticated(true)
    
    // Store in localStorage
    localStorage.setItem('authToken', authToken)
    localStorage.setItem('authUser', JSON.stringify(userData))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

