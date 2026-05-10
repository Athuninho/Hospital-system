"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for initial UI
const MOCK_PATIENTS = [
  { id: "1", mrn: "PAT-001", name: "John Doe", gender: "Male", dob: "1985-05-12", phone: "0712345678", lastVisit: "2024-05-01" },
  { id: "2", mrn: "PAT-002", name: "Jane Smith", gender: "Female", dob: "1992-08-24", phone: "0722334455", lastVisit: "2024-04-28" },
  { id: "3", mrn: "PAT-003", name: "Samuel Kamau", gender: "Male", dob: "1978-11-30", phone: "0733445566", lastVisit: "2024-05-05" },
]

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = MOCK_PATIENTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.mrn.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">Manage and view all patient records.</p>
        </div>
        <Link href="/dashboard/patients/register">
          <Button className="bg-primary hover:bg-primary/90">
            Register New Patient
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Input 
              placeholder="Search by name or MRN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">MRN</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Gender</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date of Birth</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Visit</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{patient.mrn}</td>
                    <td className="p-4 align-middle">{patient.name}</td>
                    <td className="p-4 align-middle">{patient.gender}</td>
                    <td className="p-4 align-middle">{patient.dob}</td>
                    <td className="p-4 align-middle">{patient.phone}</td>
                    <td className="p-4 align-middle">{patient.lastVisit}</td>
                    <td className="p-4 align-middle">
                      <Link href={`/dashboard/patients/${patient.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="h-24 text-center">No patients found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
