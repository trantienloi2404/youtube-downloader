import Image from 'next/image'
import { Check } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'

interface PlaylistVideoItemProps {
  video: any
  onToggleSelect?: () => void
}

const PlaylistVideoItem = ({
  video,
  onToggleSelect,
}: PlaylistVideoItemProps) => {
  return (
    <div
      className={`bg-secondary/50 overflow-hidden rounded-lg border transition-all duration-200 ${
        video.selected
          ? 'border-primary/50 shadow-primary/10 shadow-sm'
          : 'border-border hover:border-primary/30'
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-video min-h-24 flex-shrink-0 sm:aspect-auto sm:w-48">
          <Image
            src={video.thumbnail || '/placeholder.svg'}
            alt={video.title}
            fill
            className="object-cover"
          />
          <div className="absolute right-1 bottom-1 rounded-sm bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {video.duration}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 font-medium">{video.title}</h3>
              <Checkbox
                checked={video.selected}
                onCheckedChange={onToggleSelect}
                className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-1 flex-shrink-0"
              />
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              {video.author} • {video.viewCount} views
            </div>
          </div>
          <div className="mt-2 space-y-1">
            {video.downloading && (
              <Progress
                value={video.progress || 50}
                className="h-1 animate-pulse"
              />
            )}
            {video.downloaded && (
              <span className="flex items-center gap-0.5 text-xs text-green-500">
                <Check className="mr-1 h-3 w-3" />
                Downloaded
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default PlaylistVideoItem
