'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Phone } from 'lucide-react'
import { sendTextBeeOtp, verifyTextBeeOtp } from '@/app/auth/actions'
import { useRouter } from 'next/navigation'

export function TextBeeLoginForm() {
    const router = useRouter()
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [loading, setLoading] = useState(false)

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Basic validation
            if (phoneNumber.length < 10) {
                toast.error('Please enter a valid phone number')
                setLoading(false)
                return
            }

            // Ensure format 
            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`

            const result = await sendTextBeeOtp(formattedPhone)

            if (result.error) {
                toast.error(result.error)
            } else {
                setStep('otp')
                toast.success('OTP sent successfully via TextBee!')
            }
        } catch (error: any) {
            console.error(error)
            toast.error('Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`

            const result = await verifyTextBeeOtp(formattedPhone, otp)

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Login successful!')
                setTimeout(() => {
                    router.push('/dashboard')
                }, 1000)
            }

        } catch (error) {
            console.error(error)
            toast.error('Verification failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">

            {step === 'phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <div className="flex gap-2">
                            <div className="flex items-center justify-center px-3 border rounded-md bg-muted text-muted-foreground text-sm font-medium">
                                +91
                            </div>
                            <Input
                                type="tel"
                                placeholder="98765 43210"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))} // Only numbers
                                required
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">We'll send a 6-digit code via TextBee Gateway.</p>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading || phoneNumber.length < 10}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Phone className="mr-2 h-4 w-4" />
                        Send Code via SMS
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Enter Verification Code</Label>
                        <Input
                            type="text"
                            placeholder="123456"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            required
                            className="text-center text-lg tracking-widest"
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify & Login
                    </Button>
                    <Button variant="ghost" type="button" onClick={() => setStep('phone')} className="w-full">
                        Change Number
                    </Button>
                </form>
            )}
        </div>
    )
}
