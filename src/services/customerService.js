/**
 * Customer Service & Storage Engine
 * Module 4: Customer Management
 * Provides complete CRUD operations with localStorage persistence
 * and realistic courier customer seed data.
 */

export const CUSTOMER_STORAGE_KEY = 'global_connect_customers_v1'
export const CUSTOMER_INIT_KEY = 'global_connect_customers_initialized_v1'

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-1001',
    customerName: 'NovaTech Avionics Inc',
    email: 'logistics@novatech-avionics.com',
    mobileNumber: '+1 (212) 555-0192',
    address: '350 5th Avenue, Suite 4200',
    city: 'New York',
    postalCode: '10118',
    status: 'VIP',
    totalShipments: 42,
    createdAt: '2026-01-15',
  },
  {
    id: 'CUST-1002',
    customerName: 'Frankfurt Precision Engineering',
    email: 'dispatch@frankfurt-precision.de',
    mobileNumber: '+49 69 1234 5678',
    address: 'Westhafen Tower, Speicherstraße 55',
    city: 'Frankfurt',
    postalCode: '60327',
    status: 'Corporate',
    totalShipments: 68,
    createdAt: '2026-02-01',
  },
  {
    id: 'CUST-1003',
    customerName: 'Tokyo Robotics & Automation Co',
    email: 'shipping@tokyo-robotics.jp',
    mobileNumber: '+81 3 5555 0144',
    address: 'Roppongi Hills Mori Tower, Minato City',
    city: 'Tokyo',
    postalCode: '106-6108',
    status: 'Corporate',
    totalShipments: 89,
    createdAt: '2026-02-14',
  },
  {
    id: 'CUST-1004',
    customerName: 'Amazonia Bio-Labs SA',
    email: 'coldchain@amazonia-biolabs.com.br',
    mobileNumber: '+55 11 98765-4321',
    address: 'Avenida Paulista 1374, Bela Vista',
    city: 'São Paulo',
    postalCode: '01310-100',
    status: 'VIP',
    totalShipments: 34,
    createdAt: '2026-03-05',
  },
  {
    id: 'CUST-1005',
    customerName: 'Global Micro Systems Ltd',
    email: 'procurement@globalmicrosystems.co.uk',
    mobileNumber: '+44 20 7946 0912',
    address: '100 Bishopsgate, Level 18',
    city: 'London',
    postalCode: 'EC2N 4AG',
    status: 'Corporate',
    totalShipments: 55,
    createdAt: '2026-03-12',
  },
  {
    id: 'CUST-1006',
    customerName: 'Al-Mansoor Logistics Holdings',
    email: 'cargo@almansoor-holdings.ae',
    mobileNumber: '+971 4 312 8899',
    address: 'Sheikh Zayed Road, DIFC Precinct 4',
    city: 'Dubai',
    postalCode: '00000',
    status: 'VIP',
    totalShipments: 112,
    createdAt: '2026-03-18',
  },
  {
    id: 'CUST-1007',
    customerName: 'Apex Legal & Financial Counsel',
    email: 'couriers@apexlegal.com',
    mobileNumber: '+1 (212) 555-8821',
    address: '100 Wall Street, 14th Floor',
    city: 'New York',
    postalCode: '10005',
    status: 'Active',
    totalShipments: 18,
    createdAt: '2026-04-02',
  },
  {
    id: 'CUST-1008',
    customerName: 'Zurich Trust & Wealth Management',
    email: 'diplomatic@zurichtrust.ch',
    mobileNumber: '+41 44 215 5500',
    address: 'Bahnhofstrasse 45',
    city: 'Zürich',
    postalCode: '8001',
    status: 'VIP',
    totalShipments: 27,
    createdAt: '2026-04-10',
  },
  {
    id: 'CUST-1009',
    customerName: 'Pacific Silicon Labs LLC',
    email: 'ops@pacificsilicon.io',
    mobileNumber: '+1 (415) 555-9011',
    address: '450 Mission Street, Suite 900',
    city: 'San Francisco',
    postalCode: '94105',
    status: 'Active',
    totalShipments: 23,
    createdAt: '2026-05-04',
  },
  {
    id: 'CUST-1010',
    customerName: 'Iberia Pharmaceutical Research',
    email: 'enviocargo@iberiapharm.es',
    mobileNumber: '+34 91 555 4321',
    address: 'Paseo de la Castellana 259',
    city: 'Madrid',
    postalCode: '28046',
    status: 'Corporate',
    totalShipments: 39,
    createdAt: '2026-05-19',
  },
  {
    id: 'CUST-1011',
    customerName: 'Nordic CleanTech Energy AB',
    email: 'freight@nordiccleantech.se',
    mobileNumber: '+46 8 123 4567',
    address: 'Sveavägen 44',
    city: 'Stockholm',
    postalCode: '111 34',
    status: 'Active',
    totalShipments: 14,
    createdAt: '2026-06-11',
  },
  {
    id: 'CUST-1012',
    customerName: 'Singapore Marine Supply Pte Ltd',
    email: 'marine@sgmarinesupply.sg',
    mobileNumber: '+65 6789 0123',
    address: '1 HarbourFront Place, #08-01',
    city: 'Singapore',
    postalCode: '098633',
    status: 'VIP',
    totalShipments: 76,
    createdAt: '2026-07-22',
  },
]

export const getStoredCustomers = () => {
  try {
    const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS))
      localStorage.setItem(CUSTOMER_INIT_KEY, 'true')
      return INITIAL_CUSTOMERS
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to parse customers from storage:', err)
    return INITIAL_CUSTOMERS
  }
}

export const saveStoredCustomers = (customers) => {
  try {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers))
  } catch (err) {
    console.error('Failed to save customers to storage:', err)
  }
}

// Generate unique customer ID
export const generateCustomerId = () => {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `CUST-${num}`
}

/**
 * 1. FETCH ALL CUSTOMERS
 */
export const fetchCustomers = async () => {
  // Simulate slight network delay for smooth UI skeleton feedback
  await new Promise((resolve) => setTimeout(resolve, 200))
  const data = getStoredCustomers()
  return {
    success: true,
    data,
    total: data.length,
  }
}

/**
 * 2. FETCH SINGLE CUSTOMER BY ID
 */
export const fetchCustomerById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 150))
  const customers = getStoredCustomers()
  const matched = customers.find(
    (c) => c.id?.toLowerCase() === id?.toLowerCase()
  )
  if (!matched) {
    throw new Error(`Customer with ID '${id}' was not found.`)
  }
  return matched
}

/**
 * 3. CREATE CUSTOMER
 */
export const createCustomer = async (customerData) => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const customers = getStoredCustomers()

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
  }

  const updated = [newCustomer, ...customers]
  saveStoredCustomers(updated)

  return {
    success: true,
    data: newCustomer,
  }
}

/**
 * 4. UPDATE CUSTOMER
 */
export const updateCustomer = async (id, customerData) => {
  await new Promise((resolve) => setTimeout(resolve, 300))
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

  customers[index] = updatedRecord
  saveStoredCustomers(customers)

  return {
    success: true,
    data: updatedRecord,
  }
}

/**
 * 5. DELETE CUSTOMER
 */
export const deleteCustomer = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const customers = getStoredCustomers()
  const filtered = customers.filter(
    (c) => c.id?.toLowerCase() !== id?.toLowerCase()
  )

  saveStoredCustomers(filtered)

  return {
    success: true,
    id,
  }
}
