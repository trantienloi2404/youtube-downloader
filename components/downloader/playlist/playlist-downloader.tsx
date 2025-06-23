'use client'

import { useState } from 'react'
import { Search, Filter, Download, Square, Check, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import PlaylistPreview from './playlist-preview'
import PlaylistVideoItem from './playlist-video-item'
import AdvancedOptions, { AdvancedOptionsState } from '../advanced-options'
import FormatSelector from '../format-selector'
import { usePlaylistDownload } from '@/hooks/use-playlist-download'

const PlaylistDownloader = ({ playlistInfo }: { playlistInfo: any }) => {
  const [videos, setVideos] = useState(playlistInfo.videos)
  const [selectedVideoFormat, setSelectedVideoFormat] = useState('')
  const [selectedAudioFormat, setSelectedAudioFormat] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAllSelected, setIsAllSelected] = useState(true)
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptionsState | null>(null)
  const { isDownloading, downloadComplete, error, cmdOutput, startDownload } = usePlaylistDownload()
  const isAudioOnly = !selectedVideoFormat && !!selectedAudioFormat

  const filteredVideos = videos.filter((video: any) => video.title.toLowerCase().includes(searchTerm.toLowerCase()))
  const handleSelectAll = () => {
    setIsAllSelected(!isAllSelected)
    setVideos(
      videos.map((video: any) => ({
        ...video,
        selected: !isAllSelected,
      })),
    )
  }
  const handleDownload = () => {
    if (!selectedVideoFormat && !selectedAudioFormat) {
      // setError('Please select at least one format (video or audio)')
      return
    }

    const selectedVideos = videos.filter((v: any) => v.selected)
    if (selectedVideos.length === 0) {
      // setError('Please select at least one video')
      return
    }

    const formatId = [selectedVideoFormat, selectedAudioFormat].filter(Boolean).join('+')
    const finalOptions = {
      ...(advancedOptions || {}),
      isAudioOnly: isAudioOnly,
    }
    startDownload(playlistInfo.id, formatId, finalOptions, selectedVideos)
  }
  const getDownloadButtonText = () => {
    if (isDownloading) return `Downloading ${videos.filter((v: any) => v.selected).length} videos...`

    const selectedCount = videos.filter((v: any) => v.selected).length
    const suffix = selectedCount !== 1 ? 's' : ''

    if (selectedVideoFormat && selectedAudioFormat) return `Download ${selectedCount} Video${suffix} with Audio`
    if (selectedVideoFormat) return `Download ${selectedCount} Video${suffix} Only`
    if (selectedAudioFormat) return `Download ${selectedCount} Audio${suffix} Only`

    return `Download ${selectedCount} Video${suffix}`
  }
  return (
    <div className="space-y-6">
      <PlaylistPreview playlistInfo={playlistInfo} />
      <Card className="border-primary/20 shadow-primary/5 border shadow-lg">
        <CardContent className="space-y-6 p-6">
          {/* Search and Filter */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-grow">
              <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                <Search className="h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="Search videos in playlist..."
                className="border-primary/20 focus:border-primary/50 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={
                  isAllSelected
                    ? 'bg-secondary text-bg-secondary-foreground border-bg-secondary'
                    : 'border-bg-secondary/20 hover:border-bg-secondary/50'
                }
                onClick={handleSelectAll}
              >
                {isAllSelected ? (
                  <>
                    <Square className="mr-1 h-4 w-4" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Select All
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Video List */}
          <div className="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto pr-1">
            {filteredVideos.length === 0 ? (
              <div className="text-muted-foreground flex h-40 flex-col items-center justify-center">
                <Search className="text-muted-foreground/70 mb-2 h-8 w-8" />
                <p>No videos match your search</p>
              </div>
            ) : (
              filteredVideos.map((video: any, index: number) => (
                <PlaylistVideoItem
                  key={video.id}
                  video={video}
                  onToggleSelect={() => {
                    const updatedVideos = [...videos]
                    const videoIndex = updatedVideos.findIndex(v => v.id === video.id)
                    if (videoIndex !== -1) {
                      updatedVideos[videoIndex].selected = !updatedVideos[videoIndex].selected
                      setVideos(updatedVideos)
                      setIsAllSelected(updatedVideos.every((v) => v.selected))
                    }
                  }}
                />
              ))
            )}
          </div>

          {/* Format Selector */}
          <FormatSelector
            selectedVideoFormat={selectedVideoFormat}
            selectedAudioFormat={selectedAudioFormat}
            onSelectVideo={setSelectedVideoFormat}
            onSelectAudio={setSelectedAudioFormat}
          />

          {/* Advanced Options */}
          <AdvancedOptions
            filename={playlistInfo.title}
            subtitles={playlistInfo.subtitles}
            isPlaylist={false}
            isAudioOnly={isAudioOnly}
            onOptionsChange={setAdvancedOptions}
          />

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="mr-2 h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Download Progress */}
          {isDownloading && (
            <div className="bg-secondary/50 border-primary/10 space-y-2 rounded-lg border p-4">
              <p>Downloading...</p>
              <span className="font-medium">{cmdOutput}</span>
            </div>
          )}

          {/* Download Complete */}
          {downloadComplete && (
            <div className="space-y-2 rounded-lg border border-green-800 bg-green-900/20 p-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-500">Download Complete!</p>
                  <p className="text-sm text-green-400">All files have been successfully downloaded.</p>
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 py-6 transition-all duration-300 hover:from-blue-700 hover:to-violet-700"
            onClick={handleDownload}
            disabled={
              isDownloading ||
              (!selectedVideoFormat && !selectedAudioFormat) ||
              videos.filter((v: any) => v.selected).length === 0
            }
          >
            <Download className="mr-2 h-5 w-5" />
            {getDownloadButtonText()}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default PlaylistDownloader
