// Core permissions as constants
export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_PERMISSIONS: 'manage_permissions',
  MANAGE_CONTENT: 'manage_content',
  PUBLISH_CONTENT: 'publish_content',
  MANAGE_MEDIA: 'manage_media',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// Role names
export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  PUBLISHER: 'publisher',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]
