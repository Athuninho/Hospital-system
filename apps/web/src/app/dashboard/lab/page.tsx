"use client"

import { useState, useEffect } from "react"
import { Microscope, Search, CheckCircle2, AlertCircle, FileUp, ClipboardList, TrendingUp } from "lucide-react"

export default function LaboratoryDashboard() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending") // pending | completed

  useEffect(() => {
    // Fetch pending and completed lab requests
    fetch('/api/clinical/lab/requests/pending?hospitalId=mock-hosp')
      .then(res => res.json())
      .then(data => {
        setRequests(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleReport = (requestId: string) => {
    const result = prompt("Enter test result (e.g. Normal, Positive, 5.4 mmol/L):")
    if (!result) return

    fetch(`/api/clinical/lab/requests/${requestId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resultData: { value: result }, reportedBy: "Lab Tech John" })
    })
    .then(res => res.json())
    .then(() => {
      alert("Result reported successfully!")
      // Refresh list
      setRequests(requests.filter(r => r.id !== requestId))
    })
    .catch(() => alert("Failed to report result"))
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laboratory Information System</h1>
          <p className="text-muted-foreground">Manage diagnostic tests, report results, and track sample processing.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-600 px-4 py-2 rounded-lg border border-blue-500/20">
            <TrendingUp size={18} />
            <span className="font-semibold">Turnaround Time: 45m</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-card border rounded-2xl shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
          <h3 className="text-3xl font-bold mt-2">{requests.length}</h3>
        </div>
        <div className="p-6 bg-card border rounded-2xl shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Tests Today</p>
          <h3 className="text-3xl font-bold mt-2 text-primary">124</h3>
        </div>
        <div className="p-6 bg-card border rounded-2xl shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Critical Results</p>
          <h3 className="text-3xl font-bold mt-2 text-red-600">3</h3>
        </div>
        <div className="p-6 bg-card border rounded-2xl shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Equipment Status</p>
          <div className="flex items-center gap-2 mt-2 text-green-600">
            <CheckCircle2 size={18} />
            <span className="font-semibold">All Operational</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button 
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-4 text-sm font-medium transition-all relative ${
            activeTab === "pending" ? "text-primary" : "text-muted-foreground hover:text-primary/70"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            Pending Tests
          </div>
          {activeTab === "pending" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("completed")}
          className={`px-6 py-4 text-sm font-medium transition-all relative ${
            activeTab === "completed" ? "text-primary" : "text-muted-foreground hover:text-primary/70"
          }`}
        >
          <div className="flex items-center gap-2">
            <ClipboardList size={16} />
            Completed Results
          </div>
          {activeTab === "completed" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
        </button>
      </div>

      <div className="space-y-6">
        <div className="border rounded-2xl overflow-hidden bg-card shadow-sm">
          <div className="p-4 border-b bg-muted/10">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="text" 
                placeholder="Search patient or test type..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Test Requested</th>
                <th className="px-6 py-4">Requested By</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Time Elapsed</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.length > 0 ? requests.map((req) => (
                <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold">{req.patient?.firstName} {req.patient?.lastName}</div>
                    <div className="text-xs text-muted-foreground">MRN: {req.patient?.medicalRecordNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Microscope size={16} className="text-primary" />
                      <span className="font-medium">{req.testType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">Dr. {req.staff?.lastName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600">Urgent</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">12m 45s</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleReport(req.id)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary/90"
                      >
                        Enter Result
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground" title="Upload Scan">
                        <FileUp size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    {loading ? "Loading laboratory data..." : "No pending laboratory requests."}
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
