'use client'

import { triggerDownload } from '@/lib/utils'
import { useState } from 'react'

interface DownloadStats {
  speed: string
  size: string
  eta: string
  progress: number
}

const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [error, setError] = useState(null)
  const [downloadStats, setDownloadStats] = useState<DownloadStats>({
    speed: '',
    size: '',
    eta: '',
    progress: 0,
  })

  const startDownload = async (isPlaylist: Boolean, contentId: any, formatId: string, advancedOptions: any = {}) => {
    try {
      setIsDownloading(true)
      setDownloadStats({
        speed: '',
        size: '',
        eta: '',
        progress: 0,
      })
      setDownloadComplete(false)
      setError(null)

      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          formatId,
          options: {
            filename: advancedOptions.filename,
            skipSponsor: advancedOptions.skipSponsor,
            embedThumbnail: advancedOptions.embedThumbnail,
            embedChapter: advancedOptions.embedChapter,
            embedMetadata: advancedOptions.embedMetadata,
            embedSubtitle: advancedOptions.embedSubtitle,
            subtitleLanguage: advancedOptions.subtitleLanguage,
          },
        }),
      })

      if (!response.ok) throw new Error('Download failed - server error')
      const reader = response.body?.getReader()
      if (!reader) throw new Error('Download failed - invalid response')

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          const response = await fetch(`/api/download?file=${contentId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Download failed')
          }

          const reader = response.body?.getReader()
          const contentLength = response.headers.get('Content-Length')
          const contentDisposition = response.headers.get('Content-Disposition')
          const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
          const filename = filenameMatch ? filenameMatch[1] : 'download'

          if (!reader || !contentLength) {
            throw new Error('Download failed - invalid response')
          }

          const chunks: Uint8Array[] = []

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            chunks.push(value)
          }

          const blob = new Blob(chunks)
          setDownloadComplete(true)
          triggerDownload(blob, filename)
          break
        }

        const events = decoder.decode(value).split('\n\n')
        for (const event of events) {
          if (!event.trim()) continue
          const data = JSON.parse(event.replace('data: ', ''))
          setDownloadStats({
            speed: data.speed,
            size: data.size,
            eta: data.eta,
            progress: data.progress,
          })
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while downloading')
    } finally {
      setIsDownloading(false)
    }
  }

  return {
    isDownloading,
    downloadComplete,
    error,
    downloadStats,
    startDownload,
  }
}

export { useDownload }
