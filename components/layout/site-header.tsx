'use client'

import Link from 'next/link'
import { Youtube, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ThemeToggle from './theme-toggle'

const SiteHeader = () => {
  return (
    <header className="bg-background/80 border-border/40 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <div className="group-hover:shadow-primary/20 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-purple-500 transition-all duration-300 group-hover:shadow-md">
            <Youtube className="h-5 w-5 text-white" />
          </div>
          <span className="group-hover:text-primary hidden font-bold transition-colors sm:inline-block">
            YouTube Downloader
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild className="rounded-full">
            <Link href="https://github.com/trantienloi2404/youtube-downloader" target="_blank">
              <Github className="text-primary h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
