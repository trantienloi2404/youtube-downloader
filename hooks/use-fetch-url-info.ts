'use client'

import { useState } from 'react'
const useFetchUrlInfo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [contentInfo, setContentInfo] = useState<any>(null)
  const [contentType, setContentType] = useState<'video' | 'playlist' | null>(
    null,
  )
  const fetchUrlInfo = async (url: string) => {
    setIsLoading(true)
    setError('')
    setContentInfo(null)
    setContentType(null)

    try {
      const isPlaylist = url.includes('list=') && !url.includes('&index=')
      if (isPlaylist) {
        const response = await fetch('/api/fetch-playlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch playlist information')
        }
        setContentType('playlist')
        setContentInfo(data.playlistInfo)
      } else {
        const response = await fetch('/api/fetch-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch video information')
        }
        setContentType('video')
        setContentInfo(data.videoInfo)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching information')
    } finally {
      setIsLoading(false)
    }
  }
  return {
    isLoading,
    error,
    contentType,
    contentInfo,
    fetchUrlInfo,
  }
}
export { useFetchUrlInfo }
