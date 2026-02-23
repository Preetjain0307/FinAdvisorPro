"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, FileText, Bot, AlertTriangle, CheckCircle2, Pencil, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

interface Asset { id: string; asset_type: string; details: string; nominee: string | null }

export default function EstatePlanningPage() {
    const [assets, setAssets] = useState<Asset[]>([])
    const [loading, setLoading] = useState(true)
    const [newType, setNewType] = useState("Bank")
    const [newDetails, setNewDetails] = useState("")
    const [newNominee, setNewNominee] = useState("")
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null)

    const supabase = createClient()

    const load = useCallback(async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const { data, error } = await supabase
            .from("estate_assets").select("*")
            .eq("user_id", user.id).order("created_at", { ascending: true })

        if (error) { toast.error("Failed to load estate data"); setLoading(false); return }

        if (!data || data.length === 0) {
            const defaults = [
                { asset_type: "Bank Account", details: "SBI Savings", nominee: "Wife" },
                { asset_type: "Crypto", details: "Wallet XYZ", nominee: null },
            ]
            const { data: inserted } = await supabase
                .from("estate_assets")
                .insert(defaults.map(d => ({ ...d, user_id: user.id })))
                .select()
            setAssets(inserted || [])
        } else {
            setAssets(data)
        }
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])

    const addAsset = async () => {
        if (!newDetails) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from("estate_assets")
            .insert({ user_id: user.id, asset_type: newType, details: newDetails, nominee: newNominee || null })
            .select().single()

        if (error) { toast.error("Failed to add asset"); return }
        setAssets([...assets, data])
        setNewDetails(""); setNewNominee("")
        toast.success("Asset Added to Will")
    }

    const deleteAsset = async (id: string) => {
        await supabase.from("estate_assets").delete().eq("id", id)
        setAssets(assets.filter(a => a.id !== id))
        toast.error("Asset Removed")
    }

    const saveEdit = async () => {
        if (!editingAsset) return
        const { error } = await supabase.from("estate_assets")
            .update({ asset_type: editingAsset.asset_type, details: editingAsset.details, nominee: editingAsset.nominee })
            .eq("id", editingAsset.id)
        if (error) { toast.error("Update failed"); return }
        setAssets(assets.map(a => a.id === editingAsset.id ? editingAsset : a))
        setEditingAsset(null)
        toast.success("Asset Updated")
    }

    const totalAssets = assets.length
    const withNominee = assets.filter(a => a.nominee).length
    const score = totalAssets > 0 ? (withNominee / totalAssets) * 100 : 0

    const getAIMsg = () => {
        if (score === 100 && totalAssets > 0) return { msg: "Perfect! All assets have assigned beneficiaries.", color: "text-green-500" }
        if (totalAssets === 0) return { msg: "Start by adding your assets (Bank, Stocks, Real Estate).", color: "text-blue-500" }
        return { msg: `Attention: ${totalAssets - withNominee} assets have NO nominee. These will get frozen upon death. Fix immediately.`, color: "text-red-500" }
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900"><DashboardNavbar />
            <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <Card className="bg-slate-900 text-white border-0 mb-8">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <div className="h-16 w-16 rounded-full border-4 border-blue-500 flex items-center justify-center text-xl font-bold">
                                {score.toFixed(0)}%
                            </div>
                            <div>
                                <h1 className="text-xl font-bold flex items-center gap-2"><Bot className="h-5 w-5 text-yellow-400" /> Legacy Readiness Score</h1>
                                <p className={`font-medium ${getAIMsg().color}`}>{getAIMsg().msg}</p>
                            </div>
                        </div>
                        {score < 100 && totalAssets > 0 && <Button variant="destructive" size="sm">Fix Gaps Now</Button>}
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle>Asset Inventory</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input placeholder="Asset (e.g. SBI Savings)" value={newDetails} onChange={e => setNewDetails(e.target.value)} />
                                <Input placeholder="Nominee" value={newNominee} onChange={e => setNewNominee(e.target.value)} />
                                <Button onClick={addAsset}><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="space-y-2">
                                {assets.map(a => (
                                    <div key={a.id} className="flex justify-between p-3 border rounded bg-white items-center group">
                                        <div>
                                            <div className="font-semibold">{a.details}</div>
                                            <div className="text-xs text-muted-foreground">{a.asset_type}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {a.nominee
                                                ? <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />{a.nominee}</Badge>
                                                : <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Missing</Badge>}
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingAsset(a)}><Pencil className="h-3 w-3 text-blue-500" /></Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader><DialogTitle>Edit Asset</DialogTitle></DialogHeader>
                                                        {editingAsset && (
                                                            <div className="space-y-4">
                                                                <div className="space-y-2"><Label>Asset Details</Label><Input value={editingAsset.details} onChange={e => setEditingAsset({ ...editingAsset, details: e.target.value })} /></div>
                                                                <div className="space-y-2"><Label>Nominee</Label><Input value={editingAsset.nominee || ""} onChange={e => setEditingAsset({ ...editingAsset, nominee: e.target.value })} /></div>
                                                                <Button onClick={saveEdit}>Save Changes</Button>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteAsset(a.id)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-50">
                        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> AI Generated Will Preview</CardTitle></CardHeader>
                        <CardContent className="h-[300px] overflow-auto font-serif text-sm p-4 bg-white border shadow-inner whitespace-pre-line">
                            {`I, [Name], hereby bequeath:\n\n` + assets.map((a, i) => `${i + 1}. ${a.details} (${a.asset_type}) to -> ${a.nominee || "[PENDING NOMINEE]"}`).join("\n")}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
