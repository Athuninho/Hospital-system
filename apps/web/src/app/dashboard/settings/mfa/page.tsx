"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function MfaSettingsPage() {
  const [setupData, setSetupData] = useState<{ secret: string; qrCodeDataUrl: string } | null>(null)
  const [code, setCode] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const initTotpSetup = async () => {
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch("http://localhost:3001/auth/mfa/setup", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
      if (!res.ok) throw new Error("Failed to initialize TOTP")
      const data = await res.json()
      setSetupData(data)
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyAndEnableTotp = async () => {
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch("http://localhost:3001/auth/mfa/enable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ token: code })
      })
      if (!res.ok) throw new Error("Invalid code")
      setMessage("TOTP MFA successfully enabled!")
      setSetupData(null)
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const setupSms = async () => {
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch("http://localhost:3001/auth/mfa/sms/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ phone })
      })
      if (!res.ok) throw new Error("Failed to setup SMS")
      setMessage("SMS setup initiated. Check your phone for a code.")
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verifySms = async () => {
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch("http://localhost:3001/auth/mfa/sms/enable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ token: code })
      })
      if (!res.ok) throw new Error("Invalid code")
      setMessage("SMS MFA successfully enabled!")
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Multi-Factor Authentication Setup</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Authenticator App (TOTP)</CardTitle>
            <CardDescription>Use an app like Google Authenticator or Authy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!setupData ? (
              <Button onClick={initTotpSetup} disabled={loading}>Setup Authenticator App</Button>
            ) : (
              <div className="space-y-4">
                <img src={setupData.qrCodeDataUrl} alt="QR Code" className="w-48 h-48 border rounded" />
                <p className="text-sm font-mono bg-muted p-2 rounded">{setupData.secret}</p>
                <div className="grid gap-2">
                  <Label>Verification Code</Label>
                  <Input 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    placeholder="Enter 6-digit code" 
                  />
                  <Button onClick={verifyAndEnableTotp} disabled={loading}>Verify & Enable</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SMS Verification</CardTitle>
            <CardDescription>Receive codes via text message.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Phone Number</Label>
              <Input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="+254712345678" 
              />
              <Button onClick={setupSms} disabled={loading || !phone}>Setup SMS</Button>
            </div>
            
            <div className="grid gap-2 pt-4 border-t">
              <Label>Verification Code</Label>
              <Input 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                placeholder="Enter 6-digit code from SMS" 
              />
              <Button onClick={verifySms} disabled={loading || !code}>Verify & Enable SMS</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {message && (
        <div className="mt-6 p-4 rounded bg-primary/10 text-primary">
          {message}
        </div>
      )}
    </div>
  )
}
