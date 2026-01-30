'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface RealtimeRefreshProps {
  table: string
  children: React.ReactNode
}

export function RealtimeRefresh({ table, children }: RealtimeRefreshProps) {
  const router = useRouter()

  useEffect(() => {
    console.log(`[RealtimeRefresh] Setting up subscription for ${table}`)

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          console.log(`[RealtimeRefresh] Change detected:`, payload)
          router.refresh()
        }
      )
      .subscribe((status) => {
        console.log(`[RealtimeRefresh] Subscription status:`, status)
      })

    return () => {
      console.log(`[RealtimeRefresh] Cleaning up subscription for ${table}`)
      supabase.removeChannel(channel)
    }
  }, [table, router])

  return <>{children}</>
}
