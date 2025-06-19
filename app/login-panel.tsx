"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Lock, User, Eye, EyeOff } from "lucide-react"

interface LoginPanelProps {
  onLogin: (authenticated: boolean) => void
  onClose: () => void
}

// Demo credentials - in production, this would be handled by a secure backend
const DEMO_CREDENTIALS = {
  username: "admin",
  password: "church2024",
}

export function LoginPanel({ onLogin, onClose }: LoginPanelProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      localStorage.setItem("cms-auth", "true")
      localStorage.setItem("cms-login-time", Date.now().toString())
      onLogin(true)
    } else {
      setError("Invalid username or password. Please try again.")
    }

    setIsLoading(false)
  }

  const handleDemoLogin = () => {
    setUsername(DEMO_CREDENTIALS.username)
    setPassword(DEMO_CREDENTIALS.password)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Lock className="h-6 w-6 text-green-600" />
                <CardTitle className="text-2xl">Admin Login</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">Enter your credentials to access the Content Management System</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo credentials helper */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h4>
              <p className="text-xs text-blue-600 mb-3">For demonstration purposes, use these credentials:</p>
              <div className="space-y-1 text-xs font-mono text-blue-700">
                <p>
                  <strong>Username:</strong> {DEMO_CREDENTIALS.username}
                </p>
                <p>
                  <strong>Password:</strong> {DEMO_CREDENTIALS.password}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDemoLogin}
                className="mt-3 text-blue-600 border-blue-300 hover:bg-blue-100"
              >
                Fill Demo Credentials
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">Secure access to church content management</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
