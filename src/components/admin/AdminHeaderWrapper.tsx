"use client"

import dynamic from "next/dynamic"
import React from "react"

const AdminHeader = dynamic(() => import("./AdminHeader"), { ssr: false })

export default function AdminHeaderWrapper({ user }: { user: { name?: string; email?: string; avatarUrl?: string } }) {
  return <AdminHeader user={user} />
}
