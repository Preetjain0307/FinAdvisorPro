"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, X, CheckCircle2, Loader2, Calendar, Clock, User, Mail, MapPin, MessageSquare } from "lucide-react"
import { toast } from "sonner"

const TIME_SLOTS = [
    "Morning (9 AM – 12 PM)",
    "Afternoon (12 PM – 3 PM)",
    "Evening (3 PM – 6 PM)",
    "Post-work (6 PM – 8 PM)",
]

export function ConsultationModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState<"form" | "success">("form")
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: "", email: "", phone: "", city: "",
        preferred_date: "", preferred_time: "", message: ""
    })

    const supabase = createClient()

    const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }))

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name || !form.email || !form.phone || !form.preferred_time) {
            toast.error("Please fill all required fields")
            return
        }
        setLoading(true)
        const { error } = await supabase.from("call_requests").insert({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            city: form.city.trim() || null,
            preferred_date: form.preferred_date || null,
            preferred_time: form.preferred_time,
            message: form.message.trim() || null,
            status: "pending",
        })
        setLoading(false)
        if (error) {
            console.error("Supabase insert error:", error)
            toast.error(error.message || "Submission failed. Please try again.")
            return
        }
        setStep("success")
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {step === "success" ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="p-4 bg-green-100 rounded-full mb-4">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Booking Confirmed! 🎉</h2>
                        <p className="text-muted-foreground mb-1">Our advisor will call you at your preferred time.</p>
                        <p className="text-sm text-muted-foreground mb-6">Reference: <span className="font-mono text-blue-600">{form.email}</span></p>
                        <Button onClick={onClose} className="w-full">Done</Button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-blue-600" /> Book a Free Consultation
                                </h2>
                                <p className="text-sm text-muted-foreground mt-0.5">Talk to a SEBI-registered advisor. 100% free, zero obligation.</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-4">
                            {/* Name + Phone */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold">
                                        <User className="h-3 w-3" /> Full Name *
                                    </Label>
                                    <Input value={form.name} onChange={set("name")} placeholder="Preet Jain" required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold">
                                        <Phone className="h-3 w-3" /> Phone Number *
                                    </Label>
                                    <Input value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" type="tel" required />
                                </div>
                            </div>

                            {/* Email + City */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold">
                                        <Mail className="h-3 w-3" /> Email *
                                    </Label>
                                    <Input value={form.email} onChange={set("email")} placeholder="you@email.com" type="email" required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold">
                                        <MapPin className="h-3 w-3" /> City
                                    </Label>
                                    <Input value={form.city} onChange={set("city")} placeholder="Mumbai" />
                                </div>
                            </div>

                            {/* Preferred Date */}
                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1 text-xs font-semibold">
                                    <Calendar className="h-3 w-3" /> Preferred Date (optional)
                                </Label>
                                <Input value={form.preferred_date} onChange={set("preferred_date")} type="date"
                                    min={new Date().toISOString().split("T")[0]} />
                            </div>

                            {/* Time Slot */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1 text-xs font-semibold">
                                    <Clock className="h-3 w-3" /> Preferred Time Slot *
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {TIME_SLOTS.map(slot => (
                                        <button key={slot} type="button"
                                            onClick={() => setForm(prev => ({ ...prev, preferred_time: slot }))}
                                            className={`text-sm px-3 py-2.5 rounded-lg border text-left transition-all font-medium
                                                ${form.preferred_time === slot
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"}`}>
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1 text-xs font-semibold">
                                    <MessageSquare className="h-3 w-3" /> Your Goal / Message (optional)
                                </Label>
                                <Textarea value={form.message} onChange={set("message")}
                                    placeholder="e.g. I want to start SIP, plan for retirement, reduce tax..." rows={3} />
                            </div>

                            {/* Submit */}
                            <Button type="submit" disabled={loading} className="w-full h-12 text-base gap-2">
                                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking...</> : <><Phone className="h-4 w-4" /> Book Free Consultation</>}
                            </Button>
                            <p className="text-center text-xs text-muted-foreground">
                                🔒 Your information is 100% secure and never shared.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
