"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Save, User, HeartPulse, FileText, Pill, Microscope, ArrowLeft } from "lucide-react"

export default function ConsultationDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [encounter, setEncounter] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("vitals")

  // Form State
  const [vitals, setVitals] = useState({
    weight: "",
    height: "",
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    oxygenSaturation: ""
  })

  const [notes, setNotes] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  })

  useEffect(() => {
    fetch(`/api/clinical/encounters/${id}`)
      .then(res => res.json())
      .then(data => {
        setEncounter(data)
        if (data.vitals) setVitals(data.vitals)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    // Save encounter notes and vitals
    const payload = {
      notes: JSON.stringify(notes),
      vitals
    }

    try {
      await fetch(`/api/clinical/encounters/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      alert("Consultation saved successfully!")
    } catch (err) {
      alert("Failed to save consultation")
    }
  }

  if (loading) return <div className="p-8">Loading consultation...</div>
  if (!encounter) return <div className="p-8">Consultation not found.</div>

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
        >
          <Save size={18} />
          Complete Consultation
        </button>
      </div>

      {/* Patient Header */}
      <div className="p-6 bg-card rounded-2xl border shadow-sm flex items-center justify-between bg-gradient-to-r from-card to-muted/30">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{encounter.patient?.firstName} {encounter.patient?.lastName}</h1>
            <p className="text-muted-foreground">MRN: {encounter.patient?.medicalRecordNumber} • Age: 32 • Gender: {encounter.patient?.gender}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Consulting Doctor</p>
          <p className="font-semibold">Dr. {encounter.doctor?.lastName}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: "vitals", label: "Vitals", icon: HeartPulse },
          { id: "notes", label: "Clinical Notes", icon: FileText },
          { id: "prescriptions", label: "Prescriptions", icon: Pill },
          { id: "labs", label: "Lab Orders", icon: Microscope }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-primary/70"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === "vitals" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
            {[
              { label: "Weight (kg)", key: "weight" },
              { label: "Height (cm)", key: "height" },
              { label: "Temp (°C)", key: "temperature" },
              { label: "BP (mmHg)", key: "bloodPressure", placeholder: "120/80" },
              { label: "Heart Rate (bpm)", key: "heartRate" },
              { label: "SPO2 (%)", key: "oxygenSaturation" }
            ].map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder || "0.00"}
                  value={(vitals as any)[field.key]}
                  onChange={(e) => setVitals({ ...vitals, [field.key]: e.target.value })}
                  className="w-full p-3 rounded-xl border bg-muted/20 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {[
              { label: "Subjective (Patient Complaints)", key: "subjective" },
              { label: "Objective (Observations)", key: "objective" },
              { label: "Assessment (Diagnosis)", key: "assessment" },
              { label: "Plan (Next Steps)", key: "plan" }
            ].map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{field.label}</label>
                <textarea
                  rows={4}
                  value={(notes as any)[field.key]}
                  onChange={(e) => setNotes({ ...notes, [field.key]: e.target.value })}
                  className="w-full p-4 rounded-xl border bg-muted/20 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "prescriptions" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Search medications..." 
                className="flex-1 p-3 rounded-xl border bg-muted/20 outline-none"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl">Search</button>
            </div>
            
            <div className="border rounded-xl divide-y">
              {/* Mock items for now */}
              <div className="p-4 flex justify-between items-center bg-muted/10">
                <div>
                  <p className="font-semibold">Paracetamol 500mg</p>
                  <p className="text-xs text-muted-foreground">1 tab • 3 times daily • 5 days</p>
                </div>
                <button className="text-destructive text-sm font-medium">Remove</button>
              </div>
            </div>

            <button className="w-full py-4 border-2 border-dashed rounded-xl text-muted-foreground hover:text-primary hover:border-primary transition-all">
              + Add New Medication
            </button>
          </div>
        )}

        {activeTab === "labs" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
             <div className="grid grid-cols-2 gap-4">
              {["Full Blood Count (FBC)", "Malaria Test (BS for MPS)", "Urinalysis", "Blood Glucose", "Kidney Function Test", "Liver Function Test"].map(test => (
                <label key={test} className="flex items-center gap-3 p-4 border rounded-xl hover:bg-muted/50 cursor-pointer transition-all">
                  <input type="checkbox" className="w-4 h-4 rounded text-primary" />
                  <span className="text-sm font-medium">{test}</span>
                </label>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
