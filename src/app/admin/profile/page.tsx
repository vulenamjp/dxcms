"use client"

import React, { useState, useRef } from "react"

const mockUser = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "123-456-7890",
  avatarUrl: "",
}

export default function ProfilePage() {
  // General Info
  const [name, setName] = useState(mockUser.name)
  const [phone, setPhone] = useState(mockUser.phone)
  // Security
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  // Avatar
  const [avatarUrl, setAvatarUrl] = useState(mockUser.avatarUrl)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Toast
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  // Handlers
  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast("Profile updated!")
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match!")
      return
    }
    
    showToast("Password changed!")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => {
        setAvatarUrl(ev.target?.result as string)
        showToast("Profile photo updated!")
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50 animate-fade-in">
          {toast}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* General Info */}
        <form
          onSubmit={handleGeneralSubmit}
          className="bg-white rounded-lg shadow p-6 flex flex-col gap-4"
        >
          <h2 className="text-lg font-semibold mb-2">General Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-100"
              value={mockUser.email}
              readOnly
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>

        {/* Security */}
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white rounded-lg shadow p-6 flex flex-col gap-4"
        >
          <h2 className="text-lg font-semibold mb-2">Security</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Profile Photo */}
      <div className="mt-8 bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6">
        <div>
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl text-gray-400">
                {name[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
        </div>
        <div>
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload New Photo
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
        </div>
      </div>
    </div>
  )
}
