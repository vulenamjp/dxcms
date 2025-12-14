"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    isActive: true,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}`)
        if (!res.ok) throw new Error("Failed to fetch user")
        const data = await res.json()
        setForm({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          isActive: data.user.isActive,
        })
      } catch {
        setError("Failed to load user")
      } finally {
        setLoading(false)
      }
    }
    if (userId) fetchUser()
  }, [userId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to update user")
      router.push("/admin/users")
    } catch (err) {
      setError("Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>
  }

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select name="role" value={form.role} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-center">
          <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} className="mr-2" />
          <label className="text-sm">Active</label>
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  )
}
