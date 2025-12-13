export {
  createToken,
  verifyToken,
  setAuthCookie,
  getAuthToken,
  removeAuthCookie,
  getCurrentUser,
} from './jwt'
export type { JWTPayload } from './jwt'

export { hashPassword, verifyPassword } from './password'

export {
  requireAuth,
  requirePermission,
  requireAnyPermission,
  withAuth,
  withPermission,
  withAnyPermission,
} from './middleware'
export type { AuthenticatedRequest } from './middleware'
