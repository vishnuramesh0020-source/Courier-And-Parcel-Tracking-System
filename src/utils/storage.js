// LocalStorage keys and pre-seeded mock users for static authentication

export const STORAGE_KEYS = {
  CURRENT_USER: 'global_connect_current_user',
  USERS_LIST: 'global_connect_registered_users',
  SAVED_CREDENTIALS: 'global_connect_saved_email',
}

export const INITIAL_USERS = [
  {
    id: 'user-001',
    fullName: 'Alex Mercer',
    email: 'admin@globalconnect.com',
    password: 'Password123!',
    role: 'Administrator',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-002',
    fullName: 'Sarah Jenkins',
    email: 'agent@globalconnect.com',
    password: 'Password123!',
    role: 'Courier Dispatcher',
    phone: '+1 (555) 876-5432',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-003',
    fullName: 'David Vance',
    email: 'client@globalconnect.com',
    password: 'Password123!',
    role: 'Enterprise Client',
    phone: '+1 (555) 987-1234',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
]

export const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_LIST)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(INITIAL_USERS))
      return INITIAL_USERS
    }
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to read users from localStorage', e)
    return INITIAL_USERS
  }
}

export const saveStoredUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users))
  } catch (e) {
    console.error('Failed to save users to localStorage', e)
  }
}

export const getCurrentSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.error('Failed to read session', e)
    return null
  }
}

export const setCurrentSession = (user) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    }
  } catch (e) {
    console.error('Failed to update session', e)
  }
}
