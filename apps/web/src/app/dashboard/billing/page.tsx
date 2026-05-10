"use client"

import { useState, useEffect } from "react"
import { CreditCard, DollarSign, Receipt, ArrowUpRight, CheckCircle2, Clock } from "lucide-react"

export default function BillingDashboard() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/clinical/billing/invoices')
      .then(res => res.json())
      .then(data => {
        setInvoices(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handlePay = (invoiceId: string) => {
    const phone = prompt("Enter M-Pesa phone number (254...):", "254700000000")
    if (!phone) return

    fetch('/api/clinical/billing/payments/mpesa/stkpush', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId, phone })
    })
    .then(res => res.json())
    .then(data => {
      alert("STK Push sent to your phone! Please complete the payment.")
    })
    .catch(err => alert("Payment initiation failed"))
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
          <p className="text-muted-foreground">Manage invoices, hospital fees, and M-Pesa payments.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-lg border border-green-500/20">
            <DollarSign size={18} />
            <span className="font-semibold">Total Revenue: KES 142,500</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-card rounded-xl border shadow-sm space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
          <p className="text-2xl font-bold">156</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
          <p className="text-2xl font-bold text-yellow-600">24</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
          <p className="text-2xl font-bold text-green-600">18</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm space-y-2">
          <p className="text-sm font-medium text-muted-foreground">M-Pesa Success Rate</p>
          <p className="text-2xl font-bold text-blue-600">98.5%</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Recent Invoices</h2>
        <div className="border rounded-xl overflow-hidden bg-card">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Amount (KES)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.length > 0 ? invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{inv.id.split('-')[0]}</td>
                  <td className="px-6 py-4 font-medium">{inv.patient?.firstName} {inv.patient?.lastName}</td>
                  <td className="px-6 py-4 font-bold">{inv.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inv.status === 'PAID' ? 'bg-green-500/10 text-green-600' : 
                      inv.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-600' : 
                      'bg-red-500/10 text-red-600'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(inv.issuedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {inv.status === 'PENDING' && (
                      <button 
                        onClick={() => handlePay(inv.id)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm hover:bg-primary/90"
                      >
                        <CreditCard size={14} />
                        Pay via M-Pesa
                      </button>
                    )}
                    {inv.status === 'PAID' && (
                      <button className="flex items-center gap-2 text-primary hover:underline text-sm">
                        <Receipt size={14} />
                        View Receipt
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    {loading ? "Loading financial data..." : "No invoices found."}
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
