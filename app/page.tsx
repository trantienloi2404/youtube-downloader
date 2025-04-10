import SiteHeader from '@/components/layout/site-header'
import SiteFooter from '@/components/layout/site-footer'
import Downloader from '@/components/downloader/downloader'

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 space-y-4 text-center">
              <h1 className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl">
                YouTube Downloader
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Download videos and playlists from YouTube with custom options
              </p>
            </div>
            <Downloader />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
export default HomePage
