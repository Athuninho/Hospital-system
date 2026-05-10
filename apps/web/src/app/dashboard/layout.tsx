"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: "Overview", href: "/dashboard" },
    { name: "Patients", href: "/dashboard/patients" },
    { name: "Appointments", href: "/dashboard/appointments" },
    { name: "Clinical (EMR)", href: "/dashboard/clinical" },
    { name: "Pharmacy", href: "/dashboard/pharmacy" },
    { name: "Laboratory", href: "/dashboard/lab" },
    { name: "Billing & Payments", href: "/dashboard/billing" },
    { name: "MFA Settings", href: "/dashboard/settings/mfa" },


  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40">
        <div className="flex h-16 items-center border-b px-6">
          <span className="font-bold">Hospital Admin</span>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
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
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}
