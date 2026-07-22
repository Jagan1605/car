import { useEffect, useState } from 'react'
import { supabase, type Car } from './supabase'

export function useCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('sort_order', { ascending: true })
      if (!active) return
      if (error) {
        setError(error.message)
      } else {
        setCars((data ?? []) as Car[])
      }
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [])

  return { cars, loading, error }
}
