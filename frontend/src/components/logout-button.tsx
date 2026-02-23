'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from '@/app/auth/actions'
import { useState } from 'react'

export function LogoutButton({ variant = 'ghost', className = '' }: { variant?: 'ghost' | 'outline' | 'default' | 'destructive', className?: string }) {
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        await signOut()
    }

    return (
        <Button variant={variant} size="sm" onClick={handleLogout} disabled={loading} className={className}>
            <LogOut className="mr-2 h-4 w-4" />
            {loading ? 'Exiting...' : 'Logout'}
        </Button>
    )
}
