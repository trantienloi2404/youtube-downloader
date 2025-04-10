'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import VideoPreview from './video-preview'
import FormatSelector from '../format-selector'
import AdvancedOptions from '../advanced-options'
import { AlertCircle, Check, Download } from 'lucide-react'
import { useDownload } from '@/hooks/use-download'

const VideoDownloader = ({ videoInfo }: { videoInfo: any }) => {
  const [selectedVideoFormat, setSelectedVideoFormat] = useState('')
  const [selectedAudioFormat, setSelectedAudioFormat] = useState('')
  const [advancedOptions, setAdvancedOptions] = useState({})

  const { isDownloading, downloadComplete, error, downloadStats, startDownload } = useDownload()
  const handleDownload = () => {
    const videoFormat = videoInfo.videoFormats.find((f: any) => f.id === selectedVideoFormat)
    const audioFormat = videoInfo.audioFormats.find((f: any) => f.id === selectedAudioFormat)
    const formatId = [videoFormat?.id, audioFormat?.id].filter(Boolean).join('+')
    startDownload(false, videoInfo.id, formatId, advancedOptions)
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
            videoFormats={videoInfo.videoFormats}
            audioFormats={videoInfo.audioFormats}
            selectedVideoFormat={selectedVideoFormat}
            selectedAudioFormat={selectedAudioFormat}
            onSelectVideo={setSelectedVideoFormat}
            onSelectAudio={setSelectedAudioFormat}
          />
          <AdvancedOptions
            filename={videoInfo.title}
            subtitles={videoInfo.subtitles}
            isPlaylist={false}
            onOptionsChange={setAdvancedOptions}
          />
          {isDownloading && (
            <div className="bg-secondary/50 border-primary/10 animate-fadeIn space-y-2 rounded-lg border p-4">
              <div className="flex justify-between text-sm">
                <span>Downloading...</span>
                <span className="text-primary font-medium">{Math.round(downloadStats.progress)}%</span>
              </div>
              <Progress value={downloadStats.progress} className="h-2" />
              <div className="text-muted-foreground mt-2 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="block font-medium">Speed</span>
                  <span>{downloadStats.speed || 'Calculating...'}</span>
                </div>
                <div>
                  <span className="block font-medium">Size</span>
                  <span>{downloadStats.size || 'Calculating...'}</span>
                </div>
                <div>
                  <span className="block font-medium">ETA</span>
                  <span>{downloadStats.eta || 'Calculating...'}</span>
                </div>
              </div>
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
