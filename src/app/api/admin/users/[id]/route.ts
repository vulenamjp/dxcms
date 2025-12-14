import { NextRequest, NextResponse } from 'next/server'

// Use the same in-memory users array as in ../users/route.ts
let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'user', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]


export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const user = users.find((u) => u.id === id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json({ user })
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  const data = await req.json()
  users[idx] = { ...users[idx], ...data, updatedAt: new Date().toISOString() }
  return NextResponse.json({ user: users[idx] })
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  const deleted = users.splice(idx, 1)
  return NextResponse.json({ user: deleted[0] })
}
