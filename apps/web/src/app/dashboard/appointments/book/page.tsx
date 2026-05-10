"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function BookAppointmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push("/dashboard/appointments")
    }, 1000)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>Back</Button>
        <h1 className="text-3xl font-bold tracking-tight">Book Appointment</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Schedule Visit</CardTitle>
            <CardDescription>Select a patient and a doctor to schedule a consultation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="patient">Search Patient (Name or MRN)</Label>
              <Input id="patient" placeholder="Start typing name..." required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="doctor">Select Doctor</Label>
                <select 
                  id="doctor" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a doctor</option>
                  <option value="d1">Dr. Smith (General)</option>
                  <option value="d2">Dr. Kibaki (Emergency)</option>
                  <option value="d3">Dr. Patel (Pediatrics)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Appointment Date</Label>
                <Input id="date" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Available Slots</Label>
              <div className="grid grid-cols-4 gap-2">
                {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30"].map((slot) => (
                  <Button key={slot} variant="outline" type="button" size="sm" className="hover:bg-primary/10">
                    {slot}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Reason for Visit</Label>
              <textarea 
                id="notes" 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                placeholder="Brief description of the symptoms or purpose..."
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Confirming..." : "Book Appointment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
