"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { jwtDecode } from "jwt-decode"

interface NavItem {
  name: string
  href: string
  roles: string[]
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const decoded: any = jwtDecode(token)
      setUserRole(decoded.role)
    } catch (err) {
      localStorage.removeItem("accessToken")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const navItems: NavItem[] = [
    { name: "Overview", href: "/dashboard", roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACIST", "LAB_TECH", "ACCOUNTANT", "PATIENT"] },
    { name: "Patients", href: "/dashboard/patients", roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"] },
    { name: "Appointments", href: "/dashboard/appointments", roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PATIENT"] },
    { name: "Clinical (EMR)", href: "/dashboard/clinical", roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"] },
    { name: "Pharmacy", href: "/dashboard/pharmacy", roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST", "DOCTOR"] },
    { name: "Laboratory", href: "/dashboard/lab", roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECH", "DOCTOR"] },
    { name: "Ward Management", href: "/dashboard/wards", roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE", "DOCTOR"] },
    { name: "Billing & Payments", href: "/dashboard/billing", roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT", "RECEPTIONIST"] },
    { name: "Settings", href: "/dashboard/settings/mfa", roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACIST", "LAB_TECH", "ACCOUNTANT", "PATIENT"] },
  ]

  const filteredNavItems = navItems.filter(item => userRole && item.roles.includes(userRole))

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40">
        <div className="flex h-16 items-center border-b px-6 flex-col justify-center items-start">
          <span className="font-bold text-sm">Coast General Hospital</span>
          {userRole && <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{userRole.replace('_', ' ')}</span>}
        </div>
        <nav className="p-4 space-y-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-4 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <button 
            onClick={() => {
              localStorage.removeItem("accessToken")
              router.push("/login")
            }}
            className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-8"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {children}
      </div>
    </div>
  )
}

