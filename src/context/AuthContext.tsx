import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { authAPI } from '@/lib/api'
import { mockUsers } from '@/lib/mockData'
import type { User, UserRole } from '@/types/database'

interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
  phone?: string
  address?: string
  avatar_url?: string
  is_active: boolean
  created_at: string
}

interface AuthContextType {
  user: AuthUser | null
  profile: User | null
  isLoading: boolean
  isConfigured: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isConfigured = true // Always configured with Express backend

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        // Check for mock user in localStorage
        const mockUserStr = localStorage.getItem('mockUser')
        if (mockUserStr) {
          try {
            const mockUser = JSON.parse(mockUserStr)
            setUser(mockUser)
            setProfile(mockUser)
          } catch {
            localStorage.removeItem('mockUser')
          }
        }
        setIsLoading(false)
        return
      }

      // Get current user from backend
      const response = await authAPI.getCurrentUser()
      setUser(response.user)
      setProfile(response.user)
    } catch (error) {
      console.error('Auth check failed:', error)
      // Clear invalid token
      localStorage.removeItem('authToken')
      setUser(null)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password)
      setUser(response.user)
      setProfile(response.user)
    } catch (error) {
      // Fallback to mock authentication
      const mockUser = mockUsers.find(u => u.email === email)
      if (!mockUser) {
        throw new Error('Invalid email or password')
      }
      
      const authUser: AuthUser = {
        id: parseInt(mockUser.$id),
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        phone: mockUser.phone,
        address: mockUser.address,
        avatar_url: mockUser.avatar_url,
        is_active: mockUser.is_active,
        created_at: mockUser.$createdAt
      }
      
      setUser(authUser)
      setProfile(mockUser)
      localStorage.setItem('mockUser', JSON.stringify(mockUser))
    }
  }

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const response = await authAPI.register(email, password, name, role)
      setUser(response.user)
      setProfile(response.user)
    } catch (error) {
      // Fallback to mock registration
      const existingUser = mockUsers.find(u => u.email === email)
      if (existingUser) {
        throw new Error('Email already exists')
      }
      
      const newUser = {
        id: Date.now(),
        $id: Date.now().toString(),
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        $collectionId: 'users',
        $databaseId: 'zestio_db',
        $permissions: [],
        name,
        email,
        role,
        is_active: true,
        avatar_url: '',
        address: '',
        phone: ''
      } as User
      
      const authUser: AuthUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address,
        avatar_url: newUser.avatar_url,
        is_active: newUser.is_active,
        created_at: newUser.$createdAt
      }
      
      setUser(authUser)
      setProfile(newUser)
      localStorage.setItem('mockUser', JSON.stringify(newUser))
    }
  }

  const logout = async () => {
    try {
      authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setProfile(null)
      localStorage.removeItem('mockUser')
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await authAPI.updateProfile(data)
      setUser(response.user)
      setProfile(response.user)
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isConfigured,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
