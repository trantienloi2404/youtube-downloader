'use client'

import { FileVideo, MusicIcon, Check, Circle } from 'lucide-react'
import { AUDIO_FORMATS, VIDEO_FORMATS } from '@/lib/constants'

interface FormatSelectorProps {
  selectedVideoFormat: string
  selectedAudioFormat: string
  onSelectVideo: (id: string) => void
  onSelectAudio: (id: string) => void
}

const FormatSelector = ({
  selectedVideoFormat,
  selectedAudioFormat,
  onSelectVideo,
  onSelectAudio,
}: FormatSelectorProps) => {
  const renderFormatColumn = (
    formatsList: any[],
    formatType: 'video' | 'audio',
    selectedFormat: string,
    onSelect: (id: string) => void,
  ) => {
    return (
      <div className="grid grid-cols-1 gap-3">
        <h3 className="mb-1 flex items-center text-lg font-medium">
          {formatType === 'video' ? (
            <FileVideo className="text-primary mr-2 h-5 w-5" />
          ) : (
            <MusicIcon className="text-primary mr-2 h-5 w-5" />
          )}
          {formatType === 'video' ? 'Video Format' : 'Audio Format'}
        </h3>

        {/* None option */}
        <label
          className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all duration-200 ${
            selectedFormat === ''
              ? 'bg-primary/10 border-primary shadow-primary/10 shadow-sm'
              : 'border-border hover:border-primary/30 hover:bg-secondary/80'
          }`}
          onClick={() => onSelect('')}
        >
          <div className="flex items-center">
            <span className="font-medium">None</span>
          </div>
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
              selectedFormat === ''
                ? 'border-primary bg-primary text-primary-foreground scale-110'
                : 'border-primary/40'
            }`}
          >
            {selectedFormat === '' ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4 opacity-30" />}
          </div>
        </label>

        {/* Format options */}
        {formatsList.map((format: any) => {
          const isSelected = selectedFormat === format.id
          return (
            <label
              key={format.id}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all duration-200 ${
                isSelected
                  ? 'bg-primary/10 border-primary shadow-primary/10 shadow-sm'
                  : 'border-border hover:border-primary/30 hover:bg-secondary/80'
              }`}
              onClick={() => onSelect(format.id)}
            >
              <div className="flex items-center font-medium">{format.label}</div>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                  isSelected ? 'border-primary bg-primary text-primary-foreground scale-110' : 'border-primary/40'
                }`}
              >
                {isSelected ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4 opacity-30" />}
              </div>
            </label>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {renderFormatColumn(VIDEO_FORMATS, 'video', selectedVideoFormat, onSelectVideo)}
        </div>
        <div className="space-y-3">
          {renderFormatColumn(AUDIO_FORMATS, 'audio', selectedAudioFormat, onSelectAudio)}
        </div>
      </div>

      <div className="bg-secondary/50 border-primary/10 rounded-lg border p-4">
        <p className="text-center text-sm">
          {!selectedVideoFormat && !selectedAudioFormat && (
            <span className="text-yellow-500">Please select at least one format to download</span>
          )}
          {selectedVideoFormat && !selectedAudioFormat && (
            <span>
              You will download <strong>video only (no sound)</strong>
            </span>
          )}
          {!selectedVideoFormat && selectedAudioFormat && (
            <span>
              You will download <strong>audio only</strong>
            </span>
          )}
          {selectedVideoFormat && selectedAudioFormat && (
            <span>
              You will download <strong>video with audio</strong>
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

export default FormatSelector
