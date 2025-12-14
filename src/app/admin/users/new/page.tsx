"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewUserPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false
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
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to create user")
      router.push("/admin/users")
    } catch (err) {
      setError("Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Add New User</h1>
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
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="flex items-center">
          <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} className="mr-2" />
          <label className="text-sm">Active</label>
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {loading ? "Saving..." : "Create User"}
        </button>
      </form>
    </div>
  )
}
