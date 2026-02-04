'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginWithEmail, verifyOtp, signInWithGoogle, verifyTextBeeOtp, sendTextBeeOtp, checkUserExists } from '../auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Chrome, UserPlus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()

    // States
    // step: 'identifier' | 'password' | 'otp' | 'register-prompt'
    const [step, setStep] = useState<'identifier' | 'otp' | 'register-prompt'>('identifier')
    const [identifier, setIdentifier] = useState('') // Email or Phone
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    // Handle initial check
    const handleCheckUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Check if user exists
            const { exists } = await checkUserExists(identifier)

            if (exists) {
                // User exists -> Proceed to Login
                // If phone (starts with + or is number), send OTP
                // If email, send OTP/Magic Link

                const isPhone = /^\+?[0-9]{10,15}$/.test(identifier)

                if (isPhone) {
                    await sendTextBeeOtp(identifier)
                    toast.success('OTP Sent to your phone')
                } else {
                    await loginWithEmail(identifier)
                    toast.success('OTP/Link sent to your email')
                }
                setStep('otp')
            } else {
                // User does NOT exist -> Prompt Registration
                setStep('register-prompt')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error checking user')
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const isPhone = /^\+?[0-9]{10,15}$/.test(identifier)
            let result

            if (isPhone) {
                result = await verifyTextBeeOtp(identifier, otp)
            } else {
                result = await verifyOtp(identifier, otp, rememberMe)
            }

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Login Successful')
                setTimeout(() => router.push('/dashboard'), 500)
            }
        } catch (error) {
            toast.error('Verification failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Investor Login</CardTitle>
                    <CardDescription>Access your portfolio & recommendations</CardDescription>
                </CardHeader>
                <CardContent>

                    {step === 'identifier' && (
                        <form onSubmit={handleCheckUser} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Email or Phone Number</Label>
                                <Input
                                    placeholder="name@example.com or +919876543210"
                                    value={identifier}
                                    onChange={e => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Continue <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    )}

                    {step === 'register-prompt' && (
                        <div className="text-center space-y-6 py-4">
                            <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                                <UserPlus className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Account Not Found</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    We couldn't find an account for <strong>{identifier}</strong>.
                                </p>
                            </div>

                            <Link href="/register">
                                <Button className="w-full">
                                    Create New Account
                                </Button>
                            </Link>

                            <Button variant="ghost" onClick={() => setStep('identifier')} className="w-full">
                                Try a different ID
                            </Button>
                        </div>
                    )}

                    {step === 'otp' && (
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Enter OTP Sent to {identifier}</Label>
                                <Input
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    required
                                    className="text-center text-lg tracking-widest"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                />
                                <label htmlFor="remember" className="text-sm font-medium leading-none cursor-pointer">
                                    Remember me
                                </label>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify & Login
                            </Button>

                            <Button variant="ghost" type="button" onClick={() => setStep('identifier')} className="w-full">
                                Change Identifier
                            </Button>
                        </form>
                    )}

                    {step === 'identifier' && (
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground dark:bg-gray-950">Or</span></div>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full mt-4"
                                onClick={() => signInWithGoogle()}
                            >
                                <Chrome className="mr-2 h-4 w-4" />
                                Continue with Google
                            </Button>
                            <div className="mt-6 text-center">
                                <Link href="/admin/login" className="text-sm text-blue-600 hover:underline">
                                    Admin Login
                                </Link>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
