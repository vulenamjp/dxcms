interface Permission {
  id: string
  name: string
  description?: string | null
  createdAt?: string
  updatedAt?: string
}

interface Role {
  id: string
  name: string
  description: string | null
  rolePermissions: Permission[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: {
    id: string
    name: string
    email: string
  }
}
interface User {
  id: string
  name: string
  email: string
  userRoles: Role[]
  createdAt: string
  updatedAt: string
}

interface Service {
  id: string
  title: string
  description: string | null
  icon: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
    email: string
  }
}

interface Media {
  id: string
  filename: string
  originalName: string
  url: string
  size: number
  mimeType: string
  alt: string | null
  createdAt: string
  updatedAt: string
}


export type { Permission, Role, User, Service, Media }