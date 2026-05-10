"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock appointments
const MOCK_APPOINTMENTS = [
  { id: "1", patient: "John Doe", doctor: "Dr. Smith", time: "09:00 AM", status: "CONFIRMED", queue: 1 },
  { id: "2", patient: "Jane Smith", doctor: "Dr. Kibaki", time: "09:30 AM", status: "PENDING", queue: 2 },
  { id: "3", patient: "Samuel Kamau", doctor: "Dr. Smith", time: "10:00 AM", status: "COMPLETED", queue: 3 },
]

export default function AppointmentsPage() {
  const [filter, setFilter] = useState("TODAY")

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Manage patient schedules and live queues.</p>
        </div>
        <Link href="/dashboard/appointments/book">
          <Button className="bg-primary">Book Appointment</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">8</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">12</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Now Serving</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">Q-14</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daily Schedule</CardTitle>
            <div className="flex border rounded-md p-1 bg-muted">
              {["TODAY", "WEEK", "MONTH"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1 text-xs rounded-sm transition-all ${
                    filter === t ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left font-medium">Time</th>
                  <th className="h-12 px-4 text-left font-medium">Queue #</th>
                  <th className="h-12 px-4 text-left font-medium">Patient</th>
                  <th className="h-12 px-4 text-left font-medium">Doctor</th>
                  <th className="h-12 px-4 text-left font-medium">Status</th>
                  <th className="h-12 px-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_APPOINTMENTS.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">{app.time}</td>
                    <td className="p-4">
                      <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold">Q-{app.queue}</span>
                    </td>
                    <td className="p-4">{app.patient}</td>
                    <td className="p-4">{app.doctor}</td>
                    <td className="p-4">
                      <div className={`px-2 py-1 rounded-full text-[10px] font-bold inline-block ${
                        app.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {app.status}
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">Check-in</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
