import { NextRequest, NextResponse } from 'next/server'

// Mock in-memory users array
let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'user', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

export async function GET() {
  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const newUser = {
    id: (users.length + 1).toString(),
    name: data.name,
    email: data.email,
    role: data.role,
    isActive: data.isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  users.push(newUser)
  return NextResponse.json({ user: newUser }, { status: 201 })
}
