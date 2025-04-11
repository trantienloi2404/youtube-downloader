import { type NextRequest, NextResponse } from 'next/server'
import { getVideoInfoById } from '@/lib/utils.server'
import { formatAudioFormats, formatSubtitles, formatUploadDate, formatVideoFormats } from '@/lib/format-info'
import { getVideoId } from '@/lib/utils'

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
  const videoInfo = await getVideoInfoById(['--dump-json', '--no-playlist', '--no-warnings'], videoId)
  return {
    id: videoInfo.id,
    title: videoInfo.title,
    author: videoInfo.channel,
    duration: videoInfo.duration_string,
    viewCount: videoInfo.view_count.toLocaleString(),
    uploadDate: formatUploadDate(videoInfo.upload_date),
    description: videoInfo.description,
    thumbnail: videoInfo.thumbnail,
    videoFormats: formatVideoFormats(videoInfo.formats),
    audioFormats: formatAudioFormats(videoInfo.formats),
    subtitles: formatSubtitles(videoInfo.subtitles),
  }
}
