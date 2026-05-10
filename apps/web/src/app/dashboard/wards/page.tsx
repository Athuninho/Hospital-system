"use client"

import { useState, useEffect } from "react"
import { Bed, UserPlus, LogOut, CheckCircle2, AlertCircle, Building2, Users } from "lucide-react"

export default function WardManagementDashboard() {
  const [wards, setWards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/clinical/wards?hospitalId=mock-hosp')
      .then(res => res.json())
      .then(data => {
        setWards(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleDischarge = (admissionId: string) => {
    if (!confirm("Are you sure you want to discharge this patient?")) return

    fetch(`/api/clinical/wards/admissions/${admissionId}/discharge`, {
      method: 'PATCH'
    })
    .then(() => {
      alert("Patient discharged successfully")
      // Refresh
      window.location.reload()
    })
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ward & Bed Management</h1>
          <p className="text-muted-foreground">Monitor inpatient occupancy, manage admissions, and handle discharges.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
          <UserPlus size={18} />
          New Admission
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card border rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Building2 size={20} />
            <h3 className="font-semibold">Total Wards</h3>
          </div>
          <p className="text-3xl font-bold">{wards.length}</p>
        </div>
        <div className="p-6 bg-card border rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Bed size={20} />
            <h3 className="font-semibold">Available Beds</h3>
          </div>
          <p className="text-3xl font-bold">14</p>
        </div>
        <div className="p-6 bg-card border rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Users size={20} />
            <h3 className="font-semibold">Current Inpatients</h3>
          </div>
          <p className="text-3xl font-bold">28</p>
        </div>
      </div>

      <div className="grid gap-8">
        {wards.length > 0 ? wards.map((ward) => (
          <div key={ward.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Building2 size={24} className="text-primary" />
                {ward.name} 
                <span className="text-sm font-normal text-muted-foreground ml-2">({ward.capacity} Beds Total)</span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="h-2 w-48 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(ward.beds.filter((b: any) => b.occupied).length / ward.capacity) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {Math.round((ward.beds.filter((b: any) => b.occupied).length / ward.capacity) * 100)}% Occupied
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {ward.beds.map((bed: any) => (
                <div 
                  key={bed.id} 
                  className={`p-4 rounded-xl border-2 transition-all relative group ${
                    bed.occupied 
                      ? "border-primary/20 bg-primary/5" 
                      : "border-muted bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Bed size={20} className={bed.occupied ? "text-primary" : "text-muted-foreground"} />
                    <span className="text-xs font-mono font-bold">{bed.bedNumber}</span>
                  </div>
                  
                  {bed.occupied ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold truncate">{bed.admission?.patient?.firstName} {bed.admission?.patient?.lastName}</p>
                      <p className="text-[10px] text-muted-foreground">Since: {new Date(bed.admission?.admittedAt).toLocaleDateString()}</p>
                      <button 
                        onClick={() => handleDischarge(bed.admission?.id)}
                        className="mt-2 w-full flex items-center justify-center gap-1 py-1 rounded bg-white border text-[10px] font-bold text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                      >
                        <LogOut size={10} />
                        Discharge
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="text-[10px] font-bold text-primary hover:underline">+ Admit Patient</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )) : (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl text-muted-foreground">
            {loading ? "Loading ward data..." : "No wards configured for this hospital."}
          </div>
        )}
      </div>
    </div>
  )
}
