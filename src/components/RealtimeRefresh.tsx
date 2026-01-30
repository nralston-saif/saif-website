'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface RealtimeRefreshProps {
  table: string
  children: React.ReactNode
}

export function RealtimeRefresh({ table, children }: RealtimeRefreshProps) {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        () => {
          // Add cache-busting query param to bypass Vercel's ISR cache
          const url = new URL(window.location.href)
          url.searchParams.set('_t', Date.now().toString())
          window.location.href = url.toString()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table])

  return <>{children}</>
}
