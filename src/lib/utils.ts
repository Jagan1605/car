import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    GT: 'Grand Tourer',
    EV: 'Electric',
    SUV: 'Utility',
    Sedan: 'Sedan',
    Sport: 'Sport',
  }
  return map[category] ?? category
}
