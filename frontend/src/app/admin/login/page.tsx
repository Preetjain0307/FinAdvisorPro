'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { adminLogin } from './actions'
import { toast } from 'sonner'
import { Shield, Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        console.log('[CLIENT] Login button clicked!')
        console.log('[CLIENT] Email:', email)
        console.log('[CLIENT] Password length:', password.length)

        if (!email || !password) {
            toast.error('Please enter email and password')
            return
        }

        setLoading(true)

        try {
            console.log('[CLIENT] Calling server action...')
            const result = await adminLogin(email, password, rememberMe)
            console.log('[CLIENT] Server response:', result)

            if (result.error) {
                toast.error(result.error)
                setLoading(false)
            } else {
                toast.success('Welcome back, Admin!')

                // Store Remember Me preference in client storage
                if (typeof window !== 'undefined') {
                    if (rememberMe) {
                        localStorage.setItem('admin-remember', 'true')
                    } else {
                        sessionStorage.setItem('admin-session', 'true')
                    }
                }

                router.push('/admin')
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error('Login failed. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
                    <CardDescription>
                        Secure access for administrators only
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@finadvisor.pro"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                disabled={loading}
                            />
                            <label
                                htmlFor="remember"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                Remember me on this device
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In as Admin'}
                        </Button>

                        <div className="text-center text-sm text-muted-foreground pt-4">
                            <p>Default credentials:</p>
                            <p className="font-mono text-xs mt-1">
                                admin@finadvisor.pro / admin@123
                            </p>
                            <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2">
                                ⚠️ Change password after first login
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
