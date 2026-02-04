'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from '@/app/auth/actions'
import { useState } from 'react'

export function LogoutButton({ variant = 'ghost' }: { variant?: 'ghost' | 'outline' | 'default' | 'destructive' }) {
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        await signOut()
    }

    return (
        <Button variant={variant} size="sm" onClick={handleLogout} disabled={loading}>
            <LogOut className="mr-2 h-4 w-4" />
            {loading ? 'Exiting...' : 'Logout'}
        </Button>
    )
}
