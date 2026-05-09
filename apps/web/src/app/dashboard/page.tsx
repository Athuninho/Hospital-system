"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("accessToken")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  if (!mounted) return null

  return (
    <div className="flex flex-col flex-1">
      <header className="flex h-16 items-center border-b px-6 bg-background">
        <h1 className="text-lg font-semibold">Overview</h1>
        <div className="ml-auto flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem("accessToken")
              localStorage.removeItem("refreshToken")
              router.push("/login")
            }}
          >
            Logout
          </Button>
        </div>
      </header>
            onClick={() => {
              localStorage.removeItem("accessToken")
              localStorage.removeItem("refreshToken")
              router.push("/login")
            }}
          >
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6 bg-muted/20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-6 shadow">
            <h3 className="font-semibold tracking-tight">Total Patients</h3>
            <p className="text-2xl font-bold mt-2">1,234</p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow">
            <h3 className="font-semibold tracking-tight">Appointments Today</h3>
            <p className="text-2xl font-bold mt-2">42</p>
          </div>
        </div>
      </main>
    </div>
  )
}
