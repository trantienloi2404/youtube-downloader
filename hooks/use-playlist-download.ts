'use client'

import { getFilenameFromHeaders, sanitizeFilename, triggerDownload } from '@/lib/utils'
import { useState } from 'react'

const usePlaylistDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [error, setError] = useState(null)
  const [cmdOutput, setCmdOutput] = useState('')

  const startDownload = async (contentId: string, formatId: string, advancedOptions: any = {}) => {
    try {
      setIsDownloading(true)
      setCmdOutput('')
      setDownloadComplete(false)
      setError(null)

      const response = await fetch('/api/download-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          formatId,
          options: {
            filename: advancedOptions.filename,
            isAudioOnly: advancedOptions.isAudioOnly,
            embedThumbnail: advancedOptions.embedThumbnail,
            embedChapter: advancedOptions.embedChapter,
            embedMetadata: advancedOptions.embedMetadata,
            embedSubtitle: advancedOptions.embedSubtitle,
            subtitleLanguage: advancedOptions.subtitleLanguage,
          },
        }),
      })

      if (!response.ok || !response.body) throw new Error('Download failed - server error')
      const reader = response.body.getReader()

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          const response = await fetch(
            `/api/download-playlist?filename=${sanitizeFilename(`${advancedOptions.filename}.zip` || contentId)}`,
            {
              method: 'GET',
            },
          )
          if (!response.ok || !response.body) {
            const data = await response.json()
            throw new Error(data.error || 'Download failed')
          }
          const finalFilename = getFilenameFromHeaders(response.headers) || ''
          const blob = await response.blob()
          setDownloadComplete(true)
          triggerDownload(blob, finalFilename)
          break
        }

        const events = decoder.decode(value).split('\n\n')
        for (const event of events) {
          if (!event.trim()) continue
          setCmdOutput(event)
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
    cmdOutput,
    startDownload,
  }
}

export { usePlaylistDownload }
