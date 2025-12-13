import * as dotenv from 'dotenv'

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt' // hoặc 'bcryptjs'
import path from 'path'

const envPath = path.join(process.cwd(), '.env')
dotenv.config({ path: envPath })
console.log('📂 Loading .env from:', envPath)
console.log('🔑 DATABASE_URL status:', process.env.DATABASE_URL ? '✅ Found' : '❌ Undefined')

if (!process.env.DATABASE_URL) {
  console.error('🔴 CRITICAL ERROR: DATABASE_URL is missing!')
  console.error('👉 Hãy kiểm tra file .env của bạn có dòng: DATABASE_URL="postgresql://..." không?')
  process.exit(1)
}
const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function seedDatabase() {
  console.log('🌱 Starting database seed...')

  try {
    // ========================================================
    // 2. Create Default Permissions
    // ========================================================
    const permissionsData = [
      { name: 'manage_users', description: 'Can create, edit, and delete users' },
      { name: 'manage_roles', description: 'Can create, edit, and delete roles' },
      { name: 'manage_permissions', description: 'Can assign permissions to roles' },
      { name: 'manage_content', description: 'Can create and edit content' },
      { name: 'publish_content', description: 'Can publish content' },
      { name: 'manage_media', description: 'Can upload and manage media files' },
    ]
    
    const permissions = await Promise.all(
      permissionsData.map((p) =>
        prisma.permission.upsert({
          where: { name: p.name }, // Upsert yêu cầu 'name' phải là @unique trong schema
          update: {}, // Nếu tồn tại thì không làm gì cả
          create: {
            name: p.name,
            description: p.description,
          },
        })
      )
    )
    console.log(`✅ Permissions ready: ${permissions.length}`)
    
   

    // ========================================================
    // 3. Create Default Roles
    // ========================================================
    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: { name: 'admin', description: 'Full system access' },
    })

    const editorRole = await prisma.role.upsert({
      where: { name: 'editor' },
      update: {},
      create: { name: 'editor', description: 'Can create and edit content' },
    })

    const publisherRole = await prisma.role.upsert({
      where: { name: 'publisher' },
      update: {},
      create: { name: 'publisher', description: 'Can publish content' },
    })
    console.log('✅ Roles ready')

    // ========================================================
    // 4. Assign Permissions
    // ========================================================
    
    // Admin gets ALL
    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permission.id } },
        update: {},
        create: { roleId: adminRole.id, permissionId: permission.id },
      })
    }

    // Editor gets Content
    const editorPermissions = permissions.filter((p) => 
      ['manage_content', 'manage_media'].includes(p.name)
    )
    for (const permission of editorPermissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: editorRole.id, permissionId: permission.id } },
        update: {},
        create: { roleId: editorRole.id, permissionId: permission.id },
      })
    }

    // Publisher gets Publish
    const publisherPermissions = permissions.filter((p) => 
      ['publish_content', 'manage_content'].includes(p.name)
    )
    for (const permission of publisherPermissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: publisherRole.id, permissionId: permission.id } },
        update: {},
        create: { roleId: publisherRole.id, permissionId: permission.id },
      })
    }

    // ========================================================
    // 5. Create Admin User
    // ========================================================
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        passwordHash: hashedPassword,
        name: 'System Admin',
      },
    })

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id },
    })

    console.log('✅ Admin user ready (admin@example.com / admin123)')
    console.log('🎉 Database seeding completed!')

  } catch (e) {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()