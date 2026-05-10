"use client"

import { useState, useEffect } from "react"
import { Pill, Search, Plus, AlertTriangle, CheckCircle, Clock, Package } from "lucide-react"

export default function PharmacyDashboard() {
  const [inventory, setInventory] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState("inventory") // inventory | prescriptions

  useEffect(() => {
    // Fetch inventory and pending prescriptions
    Promise.all([
      fetch('/api/clinical/pharmacy/inventory/search?q=&hospitalId=mock-hosp'),
      fetch('/api/clinical/pharmacy/prescriptions/pending?hospitalId=mock-hosp')
    ])
    .then(async ([invRes, presRes]) => {
      const invData = await invRes.json()
      const presData = await presRes.json()
      setInventory(invData)
      setPrescriptions(presData)
      setLoading(false)
    })
    .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pharmacy Management</h1>
          <p className="text-muted-foreground">Manage drug inventory and fulfill patient prescriptions.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-4 py-2 rounded-lg transition-colors border shadow-sm">
            <Clock size={18} />
            Stock History
          </button>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
            <Plus size={18} />
            Restock Inventory
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 p-1 bg-muted/30 rounded-xl w-fit border">
        <button 
          onClick={() => setActiveView("inventory")}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeView === "inventory" ? "bg-background text-primary shadow-sm border" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Package size={16} />
            Drug Inventory
          </div>
        </button>
        <button 
          onClick={() => setActiveView("prescriptions")}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeView === "prescriptions" ? "bg-background text-primary shadow-sm border" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Pill size={16} />
            Pending Prescriptions
          </div>
        </button>
      </div>

      {activeView === "inventory" ? (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border rounded-2xl shadow-sm bg-gradient-to-br from-card to-muted/20">
              <p className="text-sm font-medium text-muted-foreground">Total Stock Items</p>
              <h3 className="text-3xl font-bold mt-2">{inventory.length}</h3>
            </div>
            <div className="p-6 bg-card border rounded-2xl shadow-sm border-yellow-500/20 bg-yellow-500/5">
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle size={18} />
                <p className="text-sm font-medium">Low Stock Alerts</p>
              </div>
              <h3 className="text-3xl font-bold mt-2 text-yellow-600">12</h3>
            </div>
            <div className="p-6 bg-card border rounded-2xl shadow-sm border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle size={18} />
                <p className="text-sm font-medium">Expiring Soon</p>
              </div>
              <h3 className="text-3xl font-bold mt-2 text-red-600">4</h3>
            </div>
          </div>

          <div className="border rounded-2xl overflow-hidden bg-card shadow-sm">
            <div className="p-4 border-b bg-muted/10 flex justify-between items-center">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="text" 
                  placeholder="Search drug name or batch..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Drug Name</th>
                  <th className="px-6 py-4">Batch #</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inventory.length > 0 ? inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.brand || "Generic"}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{item.batchNumber || "N/A"}</td>
                    <td className="px-6 py-4 font-bold">{item.quantity}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.quantity > 50 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                      }`}>
                        {item.quantity > 50 ? "In Stock" : "Low Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "No Date"}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-primary hover:underline text-sm font-medium">Update</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      {loading ? "Loading inventory..." : "No items found in stock."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border rounded-2xl overflow-hidden bg-card shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Medications</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {prescriptions.length > 0 ? prescriptions.map((pres) => (
                  <tr key={pres.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold">{pres.patient?.firstName} {pres.patient?.lastName}</div>
                      <div className="text-xs text-muted-foreground">MRN: {pres.patient?.medicalRecordNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">Dr. {pres.encounter?.doctor?.lastName}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {pres.items?.map((item: any) => (
                          <div key={item.id} className="text-xs flex items-center gap-1">
                            <Pill size={10} className="text-primary" />
                            <span className="font-medium">{item.drugName}</span>
                            <span className="text-muted-foreground">({item.dose})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pres.notes === 'FULFILLED' ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                      }`}>
                        {pres.notes === 'FULFILLED' ? "Issued" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{new Date(pres.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {pres.notes !== 'FULFILLED' && (
                        <button className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-semibold transition-all">
                          Issue Drugs
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      {loading ? "Loading prescriptions..." : "No pending prescriptions found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
