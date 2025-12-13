# Authentication & RBAC System

## Overview

Complete JWT-based authentication system with dynamic Role-Based Access Control (RBAC).

## Features

- ✅ JWT token-based authentication
- ✅ Secure password hashing with bcrypt
- ✅ HTTP-only cookie storage
- ✅ Dynamic RBAC loaded from database
- ✅ Fine-grained permission checking
- ✅ Protected API routes with middleware
- ✅ User session management

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "name": "System Admin"
  }
}
```

#### POST `/api/auth/logout`
Logout current user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/me`
Get current authenticated user with roles and permissions.

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "name": "System Admin",
    "roles": [
      {
        "id": "...",
        "name": "admin",
        "permissions": [
          "manage_users",
          "manage_roles",
          "manage_permissions",
          "manage_content",
          "publish_content",
          "manage_media"
        ]
      }
    ]
  }
}
```

### Protected Admin Routes

#### GET `/api/admin/pages`
List all pages (requires `manage_content` permission).

#### POST `/api/admin/pages`
Create a new page (requires `manage_content` permission).

**Request:**
```json
{
  "slug": "home",
  "title": "Home Page",
  "body": {
    "version": 1,
    "seo": {
      "title": "Home",
      "description": "Welcome"
    },
    "blocks": []
  },
  "status": "draft"
}
```

#### GET `/api/admin/pages/[id]`
Get a specific page (requires `manage_content` permission).

#### PATCH `/api/admin/pages/[id]`
Update a page (requires `manage_content` permission).

#### DELETE `/api/admin/pages/[id]`
Delete a page (requires `manage_content` permission).

#### POST `/api/admin/pages/[id]/publish`
Publish a page (requires `publish_content` permission).

## Permissions

The system supports the following permissions:

- `manage_users` - Create, edit, and delete users
- `manage_roles` - Create, edit, and delete roles
- `manage_permissions` - Assign permissions to roles
- `manage_content` - Create and edit content
- `publish_content` - Publish content
- `manage_media` - Upload and manage media files

## Default Roles

After running `npm run db:seed`, these roles are created:

### Admin
- Full system access
- All permissions

### Editor
- Can create and edit content
- Permissions: `manage_content`, `manage_media`

### Publisher
- Can publish content
- Permissions: `manage_content`, `publish_content`

## Usage Examples

### Protecting API Routes

```typescript
import { withPermission, AuthenticatedRequest } from '@/lib/auth/middleware'
import { PERMISSIONS } from '@/lib/rbac/constants'

export const GET = withPermission(
  PERMISSIONS.MANAGE_CONTENT,
  async (req: AuthenticatedRequest) => {
    // req.user is available here
    const userId = req.user!.userId
    
    // Your logic here
    return NextResponse.json({ data: 'protected' })
  }
)
```

### Check Multiple Permissions

```typescript
import { withAnyPermission } from '@/lib/auth/middleware'
import { PERMISSIONS } from '@/lib/rbac/constants'

export const POST = withAnyPermission(
  [PERMISSIONS.MANAGE_CONTENT, PERMISSIONS.PUBLISH_CONTENT],
  async (req: AuthenticatedRequest) => {
    // User has at least one of the permissions
    return NextResponse.json({ success: true })
  }
)
```

### Manual Permission Check

```typescript
import { userHasPermission } from '@/lib/rbac'
import { PERMISSIONS } from '@/lib/rbac/constants'

const canPublish = await userHasPermission(
  userId,
  PERMISSIONS.PUBLISH_CONTENT
)

if (canPublish) {
  // Allow action
}
```

## Testing Authentication

### 1. Login as Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }' \
  -c cookies.txt
```

### 2. Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

### 3. Access Protected Route

```bash
curl -X GET http://localhost:3000/api/admin/pages \
  -b cookies.txt
```

### 4. Create a Page

```bash
curl -X POST http://localhost:3000/api/admin/pages \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "slug": "test-page",
    "title": "Test Page",
    "body": {
      "version": 1,
      "seo": {
        "title": "Test",
        "description": "Test page"
      },
      "blocks": []
    }
  }'
```

### 5. Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

## Security Considerations

- ✅ Passwords are hashed with bcrypt (10 rounds)
- ✅ JWT tokens stored in HTTP-only cookies
- ✅ Secure flag enabled in production
- ✅ SameSite protection against CSRF
- ✅ Token expiration (7 days default)
- ✅ No sensitive data in JWT payload

## Environment Variables

Required in `.env`:

```bash
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

## File Structure

```
src/
├── app/api/
│   ├── auth/
│   │   ├── login/route.ts       # Login endpoint
│   │   ├── logout/route.ts      # Logout endpoint
│   │   └── me/route.ts          # Current user endpoint
│   └── admin/
│       └── pages/               # Protected admin routes
│           ├── route.ts
│           └── [id]/
│               ├── route.ts
│               └── publish/route.ts
├── lib/
│   ├── auth/
│   │   ├── index.ts             # Auth exports
│   │   ├── jwt.ts               # JWT utilities
│   │   ├── password.ts          # Password hashing
│   │   └── middleware.ts        # Auth middleware
│   └── rbac/
│       ├── index.ts             # RBAC exports
│       ├── constants.ts         # Permission/role constants
│       └── permissions.ts       # Permission checking
```

## Next Steps

- Implement password reset functionality
- Add email verification
- Implement refresh tokens
- Add rate limiting
- Create admin UI for user/role management
