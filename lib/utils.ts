import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVideoId(url: string): string {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regExp)
  return match ? match[1] : ''
}

export function getPlaylistId(url: string): string {
  const regExp = /[?&]list=([a-zA-Z0-9_-]+)/
  const match = url.match(regExp)
  return match ? match[1] : ''
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export function sanitizeFilename(filename: string): string {
  const invalidFsCharsRegex = /[\\/:*?"<>|\x00-\x1F]/g
  const problematicCharsRegex = /[\u2014]/g
  let sanitized = filename.replace(invalidFsCharsRegex, '_')
  sanitized = sanitized.replace(problematicCharsRegex, '-')
  sanitized = sanitized
    .replace(/_+/g, '_')
    .replace(/^[_ ]+|[_ ]+$/g, '')
    .trim()
  return sanitized
}
