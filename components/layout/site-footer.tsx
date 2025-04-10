import { Youtube, Heart } from 'lucide-react'
const SiteFooter = () => {
  return (
    <footer className="border-border/40 mt-16 border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-purple-500">
              <Youtube className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">YouTube Downloader</span>
          </div>
          <p className="text-muted-foreground mb-6 max-w-md text-sm">
            A simple tool to download videos and playlists from YouTube with
            custom options. Please respect copyright laws.
          </p>
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <span>Made with</span>
            <Heart className="h-5 w-5 animate-pulse text-red-500" />
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
