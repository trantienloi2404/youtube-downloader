'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import VideoPreview from './video-preview'
import FormatSelector from '../format-selector'
import AdvancedOptions, { AdvancedOptionsState } from '../advanced-options'
import { AlertCircle, Check, Download } from 'lucide-react'
import { useVideoDownload } from '@/hooks/use-video-download'

const VideoDownloader = ({ videoInfo }: { videoInfo: any }) => {
  const [selectedVideoFormat, setSelectedVideoFormat] = useState('')
  const [selectedAudioFormat, setSelectedAudioFormat] = useState('')
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptionsState | null>(null)
  const { isDownloading, downloadComplete, error, cmdOutput, startDownload } = useVideoDownload()
  const isAudioOnly = !selectedVideoFormat && !!selectedAudioFormat

  const handleDownload = () => {
    const formatId = [selectedVideoFormat, selectedAudioFormat].filter(Boolean).join('+')
    const finalOptions = {
      ...(advancedOptions || {}),
      filename: advancedOptions?.filename || videoInfo.title,
      isAudioOnly: isAudioOnly,
    }
    startDownload(videoInfo.id, formatId, finalOptions)
  }
  const getDownloadButtonText = () => {
    if (isDownloading) return 'Downloading...'
    if (selectedVideoFormat && selectedAudioFormat) return 'Download Video with Audio'
    if (selectedVideoFormat) return 'Download Video Only'
    if (selectedAudioFormat) return 'Download Audio Only'

    return 'Download'
  }

  return (
    <div className="space-y-6">
      <VideoPreview videoInfo={videoInfo} />
      <Card className="border-primary/20 shadow-primary/5 overflow-hidden border shadow-lg">
        <CardContent className="space-y-6 p-6">
          <FormatSelector
            selectedVideoFormat={selectedVideoFormat}
            selectedAudioFormat={selectedAudioFormat}
            onSelectVideo={setSelectedVideoFormat}
            onSelectAudio={setSelectedAudioFormat}
          />
          <AdvancedOptions
            filename={videoInfo.title}
            subtitles={videoInfo.subtitles}
            isPlaylist={false}
            isAudioOnly={isAudioOnly}
            onOptionsChange={setAdvancedOptions}
          />
          {isDownloading && (
            <div className="bg-secondary/50 border-primary/10 space-y-2 rounded-lg border p-4">
              <p>Downloading...</p>
              <span className="font-medium">{cmdOutput}</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="mr-2 h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {downloadComplete && (
            <div className="flex items-center rounded-lg border border-green-800 bg-green-900/20 p-4">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-green-500">Download Complete!</p>
                <p className="text-sm text-green-400">Your file is ready.</p>
              </div>
            </div>
          )}
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 py-6 transition-all duration-300 hover:from-blue-700 hover:to-violet-700"
            onClick={handleDownload}
            disabled={isDownloading || (!selectedVideoFormat && !selectedAudioFormat)}
          >
            <Download className="mr-2 h-5 w-5" />
            {getDownloadButtonText()}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default VideoDownloader
