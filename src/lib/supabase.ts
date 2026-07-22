import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})

export interface CarColor {
  name: string
  hex: string
}
export interface CarTrim {
  name: string
  price: number
}
export interface Car {
  id: string
  name: string
  tagline: string
  category: string
  base_price: number
  image_url: string
  accent_color: string
  description: string
  badge: string
  featured: boolean
  top_speed_mph: number
  range_miles: number
  horsepower: number
  zero_to_sixty: number
  drivetrain: string
  colors: CarColor[]
  trims: CarTrim[]
  sort_order: number
}

export interface Order {
  id: string
  car_id: string | null
  customer_name: string
  email: string
  phone: string | null
  shipping_address: string | null
  configured_color: string | null
  configured_trim: string | null
  total_price: number
  status: string
  created_at: string
}
