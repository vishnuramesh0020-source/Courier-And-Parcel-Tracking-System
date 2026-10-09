import axios from 'axios'

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'
export const CUSTOMER_STORAGE_KEY = 'global_connect_customers_v1'
export const CUSTOMER_INIT_KEY = 'global_connect_customers_initialized_v1'

// Empty fallback array - all customers are fetched directly from the Third-Party API
export const INITIAL_CUSTOMERS = []

/**
 * Transform real JSONPlaceholder user into Courier & Freight enterprise client
 */
export const transformApiUserToCustomer = (u) => {
  const statusTiers = ['VIP', 'Corporate', 'Active']
  const status = statusTiers[u.id % statusTiers.length]

  return {
    id: `CUST-${1000 + u.id}`,
    apiUserId: u.id,
    customerName: u.company?.name || u.name,
    contactPerson: u.name,
    email: u.email.toLowerCase(),
    mobileNumber: u.phone,
    address: `${u.address?.street || 'Commercial Ave'}, ${u.address?.suite || 'Suite 100'}`,
    city: u.address?.city || 'New York',
    postalCode: u.address?.zipcode || '10001',
    status,
    totalShipments: (u.id * 14) + 12,
    createdAt: `2026-0${(u.id % 8) + 1}-15`,
    source: 'Third-Party API (JSONPlaceholder /users)',
  }
}

/**
 * Read cached customers from localStorage
 */
export const getStoredCustomers = () => {
  try {
    const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Failed to parse customers from storage:', err)
    return []
  }
}

/**
 * Write customers to localStorage
 */
export const saveStoredCustomers = (customers) => {
  try {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers))
  } catch (err) {
    console.error('Failed to save customers to storage:', err)
  }
}

/**
 * Generate unique customer ID for user creations
 */
export const generateCustomerId = () => {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `CUST-${num}`
}

/**
 * 1. FETCH ALL CUSTOMERS FROM THIRD-PARTY API
 */
export const fetchCustomers = async () => {
  try {
    // Real Third-Party API Call
    const response = await axios.get(`${API_BASE_URL}/users`, { timeout: 8000 })
    const apiCustomers = Array.isArray(response.data)
      ? response.data.map(transformApiUserToCustomer)
      : []

    // Preserve any user-registered customers from local storage
    const current = getStoredCustomers()
    const userCreated = current.filter((c) => c.isUserCreated)
    const merged = [...userCreated, ...apiCustomers]

    saveStoredCustomers(merged)

    return {
      success: true,
      data: merged,
      total: merged.length,
      source: 'Third-Party API (JSONPlaceholder Live Users)',
      apiStatus: response.status,
    }
  } catch (error) {
    console.warn('Third-party API users request fallback to local cache:', error.message)
    const localData = getStoredCustomers()
    return {
      success: true,
      data: localData,
      total: localData.length,
      source: 'Local Storage Cache (Offline Resilient)',
      apiStatus: 200,
    }
  }
}

/**
 * 2. FETCH SINGLE CUSTOMER BY ID
 */
export const fetchCustomerById = async (id) => {
  let customers = getStoredCustomers()
  let matched = customers.find(
    (c) => c.id?.toLowerCase() === id?.toLowerCase()
  )
  if (!matched) {
    const res = await fetchCustomers()
    customers = res.data || []
    matched = customers.find(
      (c) => c.id?.toLowerCase() === id?.toLowerCase()
    )
  }
  if (!matched) {
    throw new Error(`Customer with ID '${id}' was not found.`)
  }
  return matched
}

/**
 * 3. CREATE CUSTOMER (Sends HTTP POST to Third-Party API)
 */
export const createCustomer = async (customerData) => {
  const newCustomer = {
    id: generateCustomerId(),
    customerName: customerData.customerName.trim(),
    email: customerData.email.trim().toLowerCase(),
    mobileNumber: customerData.mobileNumber.trim(),
    address: customerData.address.trim(),
    city: customerData.city.trim(),
    postalCode: customerData.postalCode.trim().toUpperCase(),
    status: customerData.status || 'Active',
    totalShipments: customerData.totalShipments || 0,
    createdAt: new Date().toISOString().split('T')[0],
    isUserCreated: true,
    source: 'User Registered via API',
  }

  try {
    const apiPayload = {
      name: newCustomer.customerName,
      email: newCustomer.email,
      phone: newCustomer.mobileNumber,
      address: {
        street: newCustomer.address,
        city: newCustomer.city,
        zipcode: newCustomer.postalCode,
      },
    }
    const res = await axios.post(`${API_BASE_URL}/users`, apiPayload, { timeout: 8000 })
    if (res.data?.id) {
      newCustomer.apiUserId = res.data.id
    }
  } catch (error) {
    console.warn('API POST /users failed, continuing with local persistence:', error.message)
  }

  const customers = getStoredCustomers()
  const updated = [newCustomer, ...customers]
  saveStoredCustomers(updated)

  return {
    success: true,
    data: newCustomer,
  }
}

/**
 * 4. UPDATE CUSTOMER (Sends HTTP PUT to Third-Party API)
 */
export const updateCustomer = async (id, customerData) => {
  const customers = getStoredCustomers()
  const index = customers.findIndex(
    (c) => c.id?.toLowerCase() === id?.toLowerCase()
  )

  if (index === -1) {
    throw new Error(`Customer with ID '${id}' could not be located to update.`)
  }

  const updatedRecord = {
    ...customers[index],
    customerName: customerData.customerName.trim(),
    email: customerData.email.trim().toLowerCase(),
    mobileNumber: customerData.mobileNumber.trim(),
    address: customerData.address.trim(),
    city: customerData.city.trim(),
    postalCode: customerData.postalCode.trim().toUpperCase(),
    status: customerData.status || customers[index].status || 'Active',
    updatedAt: new Date().toISOString().split('T')[0],
  }

  try {
    const apiId = customers[index].apiUserId || 1
    await axios.put(
      `${API_BASE_URL}/users/${apiId}`,
      {
        name: updatedRecord.customerName,
        email: updatedRecord.email,
        phone: updatedRecord.mobileNumber,
      },
      { timeout: 8000 }
    )
  } catch (error) {
    console.warn('API PUT /users failed, continuing with local update:', error.message)
  }

  customers[index] = updatedRecord
  saveStoredCustomers(customers)

  return {
    success: true,
    data: updatedRecord,
  }
}

/**
 * 5. DELETE CUSTOMER (Sends HTTP DELETE to Third-Party API)
 */
export const deleteCustomer = async (id) => {
  const customers = getStoredCustomers()
  const target = customers.find((c) => c.id?.toLowerCase() === id?.toLowerCase())

  if (target?.apiUserId) {
    try {
      await axios.delete(`${API_BASE_URL}/users/${target.apiUserId}`, { timeout: 8000 })
    } catch (error) {
      console.warn('API DELETE /users failed, continuing with local removal:', error.message)
    }
  }

  const filtered = customers.filter(
    (c) => c.id?.toLowerCase() !== id?.toLowerCase()
  )

  saveStoredCustomers(filtered)

  return {
    success: true,
    id,
  }
}
