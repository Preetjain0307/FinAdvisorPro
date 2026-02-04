'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteInvestment } from '../actions'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DeleteInvestmentButton({ id, name }: { id: string; name: string }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        try {
            const result = await deleteInvestment(id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(`${name} deleted successfully`)
            }
        } catch (error) {
            toast.error('Failed to delete investment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Investment?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone and will remove it from all user portfolios.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700">
                        {loading ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
