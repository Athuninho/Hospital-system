"use client"

import { useState, useEffect } from "react"
import { Search, User, FileText, Plus, Microscope, Pill } from "lucide-react"

export default function ClinicalDashboard() {
  const [encounters, setEncounters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch recent encounters
    fetch('/api/clinical/encounters')
      .then(res => res.json())
      .then(data => {
        setEncounters(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinical EMR</h1>
          <p className="text-muted-foreground">Manage patient consultations, prescriptions, and lab requests.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          <Plus size={18} />
          New Consultation
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats */}
        <div className="p-6 bg-card rounded-xl border shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <User size={20} />
            <h3 className="font-semibold">Active Patients</h3>
          </div>
          <p className="text-2xl font-bold">42</p>
          <p className="text-xs text-muted-foreground">+3 from yesterday</p>
        </div>

        <div className="p-6 bg-card rounded-xl border shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <FileText size={20} />
            <h3 className="font-semibold">Pending Notes</h3>
          </div>
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-muted-foreground">Requires signature</p>
        </div>

        <div className="p-6 bg-card rounded-xl border shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Microscope size={20} />
            <h3 className="font-semibold">Lab Results</h3>
          </div>
          <p className="text-2xl font-bold">8</p>
          <p className="text-xs text-muted-foreground">Ready for review</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Recent Consultations</h2>
        <div className="border rounded-xl overflow-hidden bg-card">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Diagnosis</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {encounters.length > 0 ? encounters.map((e) => (
                <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{e.patient?.firstName} {e.patient?.lastName}</td>
                  <td className="px-6 py-4">{e.doctor?.firstName} {e.doctor?.lastName}</td>
                  <td className="px-6 py-4">{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">{e.diagnosis || "Pending..."}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-muted rounded-md text-primary" title="Prescriptions">
                        <Pill size={16} />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-md text-primary" title="Lab Results">
                        <Microscope size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    {loading ? "Loading clinical data..." : "No recent consultations found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
