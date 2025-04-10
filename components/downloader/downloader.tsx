'use client'
import { useState } from 'react'
import { Youtube, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import VideoDownloader from './video/video-downloader'
import PlaylistDownloader from './playlist/playlist-downloader'
import { useFetchUrlInfo } from '@/hooks/use-fetch-url-info'
const Downloader = () => {
  const [url, setUrl] = useState('')
  const { isLoading, error, contentInfo, contentType, fetchUrlInfo } =
    useFetchUrlInfo()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    fetchUrlInfo(url)
  }
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card className="border-primary/20 shadow-primary/5 border shadow-lg">
        <CardContent className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-grow">
                <div className="text-primary absolute top-1/2 left-3 -translate-y-1/2">
                  <Youtube className="h-5 w-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Paste YouTube URL (video or playlist)..."
                  className="border-primary/20 focus:border-primary/50 h-12 pl-10 transition-all duration-300"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !url}
                className="h-12 bg-gradient-to-r from-blue-600 to-violet-600 px-6 transition-all duration-300 hover:from-blue-700 hover:to-violet-700"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  <>Fetch Content</>
                )}
              </Button>
            </div>
          </form>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="mr-2 h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="text-primary mb-4 h-12 w-12 animate-spin" />
          <p className="text-muted-foreground text-center">
            Fetching content information...
          </p>
        </div>
      )}

      {contentInfo && contentType === 'video' && (
        <VideoDownloader videoInfo={contentInfo} />
      )}

      {contentInfo && contentType === 'playlist' && (
        <PlaylistDownloader playlistInfo={contentInfo} />
      )}
    </div>
  )
}

export default Downloader
