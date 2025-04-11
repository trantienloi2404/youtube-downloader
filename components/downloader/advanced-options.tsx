'use client'

import { useState, useEffect } from 'react'
import {
  Sliders,
  FileText,
  Plus,
  Minus,
  Languages,
  Settings,
  Database,
  SubtitlesIcon,
  Image,
  ChartPie,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AdvancedOptionsProps {
  filename: string
  subtitles: Array<Record<string, string>>
  isPlaylist?: boolean
  onOptionsChange?: (options: AdvancedOptionsState) => void
}

interface AdvancedOptionsState {
  filename: string
  embedThumbnail: boolean
  embedChapter: boolean
  embedMetadata: boolean
  embedSubtitle: boolean
  subtitleLanguage: string
}

const AdvancedOptions = ({ filename, subtitles, isPlaylist = false, onOptionsChange }: AdvancedOptionsProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [options, setOptions] = useState<AdvancedOptionsState>({
    filename: filename,
    embedThumbnail: false,
    embedChapter: false,
    embedMetadata: false,
    embedSubtitle: false,
    subtitleLanguage: '',
  })
  useEffect(() => {
    if (options.filename !== filename) {
      const newOptions = { ...options, filename: filename }
      setOptions(newOptions)
      onOptionsChange?.(newOptions)
    } else {
      onOptionsChange?.(options)
    }
  }, [filename, onOptionsChange])
  const updateOptions = (key: keyof AdvancedOptionsState, value: any) => {
    const newOptions = { ...options, [key]: value }
    setOptions(newOptions)
    onOptionsChange?.(newOptions)
  }

  return (
    <div className="transition-all duration-300">
      <Button
        onClick={() => setShowAdvanced(!showAdvanced)}
        variant="outline"
        size="lg"
        className="border-primary/20 hover:border-primary/40 hover:bg-secondary/80 flex w-full items-center justify-between p-4 transition-all duration-200"
      >
        <span className="flex items-center">
          <Sliders className="text-primary mr-2" />
          Advanced Options
        </span>
        <span>{showAdvanced ? <Minus /> : <Plus />}</span>
      </Button>
      {showAdvanced && (
        <div className="bg-secondary/50 border-primary/10 mt-4 space-y-6 rounded-lg border p-5">
          <div className="space-y-4">
            <h4 className="border-border flex items-center border-b pb-2 font-medium">
              <Settings className="text-primary mr-2 h-5 w-5" />
              Other Options
            </h4>
            {/* Filename Options */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Label htmlFor="filename" className="flex items-center gap-0 text-sm">
                  <FileText className="text-primary mr-2 h-4 w-4" />
                  {isPlaylist ? 'Template' : 'Filename'}
                </Label>
                <Input
                  id="filename"
                  className="border-primary/20 focus:border-primary/50"
                  value={options.filename}
                  onChange={(e) => updateOptions('filename', e.target.value)}
                />
              </div>
              {isPlaylist && (
                <p className="text-muted-foreground mt-1 text-xs">
                  Available variables: {'{number}'}, {'{title}'}, {'{author}'}
                </p>
              )}
            </div>

            {/* Thumbnail */}
            <Label
              htmlFor="thumbnail"
              className="hover:bg-secondary flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Image className="text-primary h-5 w-5" />
                <span>Embed thumbnail in file</span>
              </div>
              <Checkbox
                id="thumbnail"
                className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5"
                checked={options.embedThumbnail}
                onCheckedChange={(checked) => updateOptions('embedThumbnail', !!checked)}
              />
            </Label>

            {/* Chapter */}
            <Label
              htmlFor="chapter"
              className="hover:bg-secondary flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md transition-colors"
            >
              <div className="flex items-center space-x-2">
                <ChartPie className="text-primary h-5 w-5" />
                <span>Embed chapter in file</span>
              </div>
              <Checkbox
                id="chapter"
                className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5"
                checked={options.embedChapter}
                onCheckedChange={(checked) => updateOptions('embedChapter', !!checked)}
              />
            </Label>

            {/* Metadata */}
            <Label
              htmlFor="metadata"
              className="hover:bg-secondary flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Database className="text-primary h-5 w-5" />
                <span>Embed metadata in file</span>
              </div>
              <Checkbox
                id="metadata"
                className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5"
                checked={options.embedMetadata}
                onCheckedChange={(checked) => updateOptions('embedMetadata', !!checked)}
              />
            </Label>

            {/* Subtitle */}
            <Label
              htmlFor="subtitle"
              className="hover:bg-secondary flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md transition-colors"
            >
              <div className="flex items-center space-x-2">
                <SubtitlesIcon className="text-primary h-5 w-5" />
                <span>Embed subtitle in file</span>
              </div>
              <Checkbox
                id="subtitle"
                className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5"
                checked={options.embedSubtitle}
                onCheckedChange={(checked) => {
                  updateOptions('embedSubtitle', !!checked)
                  setShowSubtitle(!!checked)
                  if (!!checked) {
                    updateOptions('subtitleLanguage', '')
                  }
                }}
              />
            </Label>

            {showSubtitle && (
              <div>
                <h4 className="border-border mt-4 flex items-center border-b pb-2 font-medium">
                  <Languages className="text-primary mr-2 h-5 w-5" />
                  Subtitle Options
                </h4>
                <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2">
                  <Label htmlFor="subtitle-language" className="text-sm whitespace-nowrap">
                    Subtitle Language
                  </Label>
                  <Select
                    value={options.subtitleLanguage}
                    onValueChange={(value) => updateOptions('subtitleLanguage', value)}
                  >
                    <SelectTrigger id="subtitle-language" className="border-primary/20 focus:border-primary/50">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {subtitles.map((item: any) => {
                        const langKey = Object.keys(item)[0]
                        const langValue = item[langKey]
                        return (
                          <SelectItem key={langKey} value={langKey}>
                            {langValue} ({langKey})
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
export default AdvancedOptions
