import { type NextRequest, NextResponse } from 'next/server'
import { formatDuration, formatSubtitles, formatViewCount } from '@/lib/format-info'
import { getVideoId } from '@/lib/utils'
import Innertube from 'youtubei.js'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }
    const videoInfo = await getVideoInfo(getVideoId(url))
    return NextResponse.json({ videoInfo })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch video information' }, { status: 500 })
  }
}

async function getVideoInfo(videoId: string) {
  const youtube = await Innertube.create()
  const { basic_info, captions } = await youtube.getBasicInfo(videoId)
  return {
    id: basic_info.id,
    title: basic_info.title,
    author: basic_info.author,
    duration: formatDuration(basic_info.duration),
    viewCount: formatViewCount(basic_info.view_count),
    description: basic_info.short_description,
    thumbnail: `https://i.ytimg.com/vi/${basic_info.id}/maxresdefault.jpg`,
    subtitles: formatSubtitles(captions?.caption_tracks),
  }
}
