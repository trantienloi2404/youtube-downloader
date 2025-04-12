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
  const invalidFsCharsRegex = /[\/:*?"<>|\x00-\x1F]/g
  const multipleSpacesRegex = /\s+/g
  const multipleUnderscoresRegex = /_+/g
  const leadingTrailingUnderscoreSpaceRegex = /^[_ ]+|[_ ]+$/g

  return filename
    .replace(invalidFsCharsRegex, ' ')
    .replace(multipleSpacesRegex, ' ')
    .replace(multipleUnderscoresRegex, '_')
    .replace(leadingTrailingUnderscoreSpaceRegex, '')
}

export function getFilenameFromHeaders(headers: Headers): string | null {
  const contentDisposition = headers.get('Content-Disposition')
  if (!contentDisposition) return null

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match && utf8Match[1]) {
    try {
      return decodeURIComponent(utf8Match[1])
    } catch (e) {
      console.error('Error decoding filename*:', e)
    }
  }

  const asciiMatch = contentDisposition.match(/filename="([^"]+)"/i)
  if (asciiMatch && asciiMatch[1]) {
    try {
      return decodeURIComponent(asciiMatch[1])
    } catch (e) {
      console.error('Error decoding filename:', e)
      return asciiMatch[1]
    }
  }

  const plainMatch = contentDisposition.match(/filename=([^;]+)/i)
  if (plainMatch && plainMatch[1]) {
    try {
      return decodeURIComponent(plainMatch[1])
    } catch (e) {
      console.error('Error decoding plain filename:', e)
      return plainMatch[1]
    }
  }

  return null
}
