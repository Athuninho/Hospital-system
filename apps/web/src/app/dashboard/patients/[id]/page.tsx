"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" // I'll assume this doesn't exist and use a div if it fails, or create it.

// Mock data for a single patient
const MOCK_PATIENT = {
  id: "1",
  mrn: "PAT-001",
  firstName: "John",
  lastName: "Doe",
  gender: "Male",
  dob: "1985-05-12",
  phone: "0712345678",
  email: "john.doe@example.com",
  nhif: "12345678",
  bloodGroup: "O+",
  allergies: ["Peanuts", "Penicillin"],
  history: [
    { id: "h1", title: "Hypertension", date: "2022-01-10", status: "Active" }
  ],
  visits: [
    { id: "v1", date: "2024-05-01", type: "Outpatient", reason: "General Checkup", doctor: "Dr. Smith" },
    { id: "v2", date: "2024-04-15", type: "Emergency", reason: "Allergic Reaction", doctor: "Dr. Kibaki" }
  ]
}

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {MOCK_PATIENT.firstName} {MOCK_PATIENT.lastName}
            </h1>
            <p className="text-muted-foreground">MRN: {MOCK_PATIENT.mrn} • {MOCK_PATIENT.gender} • {MOCK_PATIENT.dob}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Profile</Button>
          <Button className="bg-primary">New Visit</Button>
        </div>
      </div>

      <div className="flex border-b space-x-4">
        {["overview", "medical-history", "visits", "prescriptions", "lab-results"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{MOCK_PATIENT.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{MOCK_PATIENT.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">NHIF Number</p>
                  <p>{MOCK_PATIENT.nhif || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
                  <p className="text-red-600 font-bold">{MOCK_PATIENT.bloodGroup}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vitals (Latest)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">BP</span>
                  <span className="font-medium">120/80 mmHg</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Temp</span>
                  <span className="font-medium">36.5 °C</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">70 kg</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "medical-history" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {MOCK_PATIENT.allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Chronic Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                {MOCK_PATIENT.history.map((h) => (
                  <div key={h.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{h.title}</p>
                      <p className="text-xs text-muted-foreground">Diagnosed: {h.date}</p>
                    </div>
                    <Badge variant={h.status === 'Active' ? 'success' : 'outline'}>
                      {h.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "visits" && (
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Type</th>
                    <th className="p-4 text-left">Reason</th>
                    <th className="p-4 text-left">Doctor</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_PATIENT.visits.map((visit) => (
                    <tr key={visit.id} className="border-b">
                      <td className="p-4">{visit.date}</td>
                      <td className="p-4">{visit.type}</td>
                      <td className="p-4">{visit.reason}</td>
                      <td className="p-4">{visit.doctor}</td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm">View Notes</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
        
        {/* Placeholder for other tabs */}
        {(activeTab === "prescriptions" || activeTab === "lab-results") && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No records found for {activeTab.replace("-", " ")}.</p>
          </div>
        )}
      </div>
    </div>
  )
}
