'use client'

import { getFilenameFromHeaders, sanitizeFilename, triggerDownload } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

const usePlaylistDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cmdOutput, setCmdOutput] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)

  // Handle tab closure cancellation
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDownloading && abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDownloading])

  const cancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsDownloading(false)
      setError('Download cancelled by user')
      setCmdOutput('')
    }
  }

  const startDownload = async (
    playlistId: string,
    formatId: string, 
    advancedOptions: any = {}, 
    selectedVideos?: any[]
  ) => {
    try {
      setIsDownloading(true)
      setCmdOutput('')
      setDownloadComplete(false)
      setError(null)

      // Create new AbortController for this download
      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/download-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: playlistId,
          formatId,
          selectedVideos: selectedVideos || [],
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
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok || !response.body) throw new Error('Download failed - server error')
      const reader = response.body.getReader()

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          const response = await fetch(
            `/api/download-playlist?filename=${sanitizeFilename(`${advancedOptions.filename}.zip` || playlistId)}`,
            {
              method: 'GET',
              signal: abortControllerRef.current.signal,
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
      if (err.name === 'AbortError') {
        setError('Download cancelled')
      } else {
        setError(err.message || 'An error occurred while downloading')
      }
    } finally {
      setIsDownloading(false)
      abortControllerRef.current = null
    }
  }

  return {
    isDownloading,
    downloadComplete,
    error,
    cmdOutput,
    startDownload,
    cancelDownload,
  }
}

export { usePlaylistDownload }
