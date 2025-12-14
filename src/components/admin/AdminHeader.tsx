"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"

type AdminHeaderProps = {
  user: {
    name?: string
    email?: string
    avatarUrl?: string
  }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const handleLogout = () => {
    setOpen(false)
    // Mock logout
    alert("Logged out (mock)")
  }

  return (
    <div className="flex items-center space-x-4 relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        tabIndex={0}
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-lg">
            {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
          </span>
        )}
        <span className="text-sm text-gray-700 font-medium">{user.name || user.email}</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          role="menu"
          aria-label="User menu"
        >
          <Link
            href="/admin/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
            role="menuitem"
            tabIndex={0}
            onClick={() => setOpen(false)}
          >
            My Profile
          </Link>
          <button
            className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
            role="menuitem"
            tabIndex={0}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
