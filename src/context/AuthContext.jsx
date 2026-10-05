import { useState } from 'react'
import { AuthContext } from './authContextInstance'
import {
  getStoredUsers,
  saveStoredUsers,
  getCurrentSession,
  setCurrentSession,
  STORAGE_KEYS,
  INITIAL_USERS,
} from '../utils/storage'
import { toast } from 'react-toastify'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getCurrentSession())
  const [registeredUsers, setRegisteredUsers] = useState(() => getStoredUsers())
  const [loading, setLoading] = useState(false)

  // Login handler
  const login = async (email, password, rememberMe = false) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getStoredUsers()
        const normalizedEmail = email.trim().toLowerCase()
        const matched = users.find(
          (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
        )

        if (matched) {
          const authData = {
            id: matched.id,
            fullName: matched.fullName,
            email: matched.email,
            role: matched.role || 'Courier Agent',
            phone: matched.phone || '',
            avatar: matched.avatar || '',
            token: `jwt_mock_${Date.now()}_${matched.id}`,
            loginAt: new Date().toISOString(),
          }

          setUser(authData)
          setCurrentSession(authData)

          if (rememberMe) {
            localStorage.setItem(STORAGE_KEYS.SAVED_CREDENTIALS, normalizedEmail)
          } else {
            localStorage.removeItem(STORAGE_KEYS.SAVED_CREDENTIALS)
          }

          toast.success(`Welcome back, ${matched.fullName}!`, {
            position: 'top-right',
            theme: 'dark',
          })
          setLoading(false)
          resolve(authData)
        } else {
          setLoading(false)
          const emailExists = users.some(
            (u) => u.email.toLowerCase() === normalizedEmail
          )
          const errorMsg = emailExists
            ? 'Invalid password. Please check and try again.'
            : 'No account found with this email. Please register.'
          toast.error(errorMsg, {
            position: 'top-right',
            theme: 'dark',
          })
          reject(new Error(errorMsg))
        }
      }, 500)
    })
  }

  // Register handler
  const register = async (userData) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getStoredUsers()
        const normalizedEmail = userData.email.trim().toLowerCase()

        const alreadyExists = users.some(
          (u) => u.email.toLowerCase() === normalizedEmail
        )

        if (alreadyExists) {
          setLoading(false)
          const errorMsg = 'An account with this email already exists.'
          toast.error(errorMsg, {
            position: 'top-right',
            theme: 'dark',
          })
          reject(new Error(errorMsg))
          return
        }

        const newUser = {
          id: `user-${Date.now()}`,
          fullName: userData.fullName.trim(),
          email: normalizedEmail,
          password: userData.password,
          role: userData.role || 'Courier Client',
          phone: userData.phone || '',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            userData.fullName
          )}&backgroundColor=0284c7`,
          createdAt: new Date().toISOString(),
        }

        const updatedUsers = [...users, newUser]
        saveStoredUsers(updatedUsers)
        setRegisteredUsers(updatedUsers)

        // Automatically log in the newly registered user
        const authData = {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          avatar: newUser.avatar,
          token: `jwt_mock_${Date.now()}_${newUser.id}`,
          loginAt: new Date().toISOString(),
        }

        setUser(authData)
        setCurrentSession(authData)

        toast.success(`Account created! Welcome to Global Connect, ${newUser.fullName}.`, {
          position: 'top-right',
          theme: 'dark',
        })
        setLoading(false)
        resolve(newUser)
      }, 600)
    })
  }

  // Forgot password verification / request
  const requestPasswordReset = async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getStoredUsers()
        const normalizedEmail = email.trim().toLowerCase()
        const userExists = users.some((u) => u.email.toLowerCase() === normalizedEmail)

        if (!userExists) {
          toast.error('No account found associated with this email.', {
            position: 'top-right',
            theme: 'dark',
          })
          reject(new Error('User not found'))
          return
        }

        toast.info(
          `Security code sent to ${normalizedEmail}. (Use demo code: 123456)`,
          {
            position: 'top-right',
            theme: 'dark',
            autoClose: 6000,
          }
        )
        resolve(true)
      }, 500)
    })
  }

  // Reset password update
  const resetPassword = async (email, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getStoredUsers()
        const normalizedEmail = email.trim().toLowerCase()
        const userIndex = users.findIndex(
          (u) => u.email.toLowerCase() === normalizedEmail
        )

        if (userIndex === -1) {
          toast.error('Unable to update password. User not found.', {
            position: 'top-right',
            theme: 'dark',
          })
          reject(new Error('User not found'))
          return
        }

        users[userIndex].password = newPassword
        saveStoredUsers(users)
        setRegisteredUsers([...users])

        toast.success('Password successfully updated! You can now log in.', {
          position: 'top-right',
          theme: 'dark',
        })
        resolve(true)
      }, 500)
    })
  }

  // Logout handler
  const logout = () => {
    setUser(null)
    setCurrentSession(null)
    toast.info('You have been logged out of the portal.', {
      position: 'top-right',
      theme: 'dark',
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        requestPasswordReset,
        resetPassword,
        logout,
        registeredUsers,
        initialUsers: INITIAL_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
