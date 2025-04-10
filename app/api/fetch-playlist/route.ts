import { type NextRequest, NextResponse } from 'next/server'
import { getPlaylistInfoById } from '@/lib/utils.server'
import { getPlaylistId } from '@/lib/utils'
import { formatViewCount } from '@/lib/format-info'
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }
    const playlistInfo = await getPlaylistInfo(getPlaylistId(url))
    return NextResponse.json({ playlistInfo })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch playlist information' }, { status: 500 })
  }
}

async function getPlaylistInfo(playlistId: string) {
  const playlistInfo = await getPlaylistInfoById(['--dump-json', '--flat-playlist', '--no-warnings', playlistId])
  const firstVideo = playlistInfo[0]
  return {
    id: playlistId,
    title: firstVideo.playlist_title,
    author: firstVideo.channel,
    videoCount: playlistInfo.length,
    thumbnail:
      `https://i.ytimg.com/vi/${firstVideo.id}/maxresdefault.jpg` ||
      `https://i.ytimg.com/vi/${firstVideo.id}/mqdefault.jpg`,
    videos: playlistInfo.map((videoInfo: any) => ({
      id: videoInfo.id,
      title: videoInfo.title,
      author: videoInfo.channel,
      index: videoInfo.playlist_index,
      selected: true,
      duration: videoInfo.duration_string,
      viewCount: formatViewCount(videoInfo.view_count),
      thumbnail: `https://i.ytimg.com/vi/${videoInfo.id}/mqdefault.jpg`,
    })),
  }
}
