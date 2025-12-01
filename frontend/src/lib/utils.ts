import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export function getSentimentColor(score: number): string {
  if (score > 0.3) return 'text-green-500'
  if (score < -0.3) return 'text-red-500'
  return 'text-yellow-500'
}

export function getSentimentLabel(score: number): string {
  if (score > 0.3) return 'Positive'
  if (score < -0.3) return 'Negative'
  return 'Neutral'
}
