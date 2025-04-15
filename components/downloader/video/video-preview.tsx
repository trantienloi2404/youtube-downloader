import Image from 'next/image'
import { Clock, User, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const VideoPreview = ({ videoInfo }: { videoInfo: any }) => {
  return (
    <Card className="border-primary/20 overflow-hidden border p-0 shadow-lg">
      <div className="relative">
        <div className="relative aspect-video">
          <Image
            src={videoInfo.thumbnail || '/placeholder.svg?height=720&width=1280'}
            alt={videoInfo.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>
        <div className="absolute right-0 bottom-0 left-0 p-6">
          <h2 className="mb-2 text-xl font-bold text-white drop-shadow-md md:text-2xl">{videoInfo.title}</h2>

          <div className="flex flex-wrap items-center gap-3 text-sm text-white">
            <div className="flex items-center rounded-full border border-white/20 bg-black/50 px-3 py-1.5 backdrop-blur-sm">
              <User className="mr-2 h-4 w-4" />
              {videoInfo.author}
            </div>
            <div className="flex items-center rounded-full border border-white/20 bg-black/50 px-3 py-1.5 backdrop-blur-sm">
              <Eye className="mr-2 h-4 w-4" />
              {videoInfo.viewCount}
            </div>
            <div className="flex items-center rounded-full border border-white/20 bg-black/50 px-3 py-1.5 backdrop-blur-sm">
              <Clock className="mr-2 h-4 w-4" />
              {videoInfo.duration}
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-muted-foreground line-clamp-3 text-sm">{videoInfo.description}</p>
      </CardContent>
    </Card>
  )
}
export default VideoPreview
