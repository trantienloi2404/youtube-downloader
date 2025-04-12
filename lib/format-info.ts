export function formatUploadDate(dateString: string): string {
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)
  return `${year}-${month}-${day}`
}

export function formatSize(bytes: number): string {
  if (!bytes) return 'N/A'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

export function formatVideoFormats(formats: any[]): any[] {
  return Object.values(
    formats
      .filter((f) => f.vcodec !== 'none' && f.format_note && ['mp4', 'mkv', 'webm'].includes(f.video_ext))
      .reduce(
        (acc, f) => {
          const label = f.format_note || f.resolution || f.ext
          if (!acc[label] || (f.filesize_approx && (acc[label].filesize_approx ?? 0) < f.filesize_approx)) {
            acc[label] = {
              id: f.format_id,
              label: label,
              size: formatSize(f.filesize_approx),
              resolution: f.resolution,
              filesize_approx: f.filesize_approx,
            }
          }
          return acc
        },
        {} as Record<string, any>,
      ),
  ).sort((a: any, b: any) => (b.filesize_approx ?? 0) - (a.filesize_approx ?? 0))
}

export function formatAbr(abr: number): number {
  const commonABR = [64, 128, 192, 256, 320]
  return commonABR.reduce((prev, curr) => (Math.abs(curr - abr) < Math.abs(prev - abr) ? curr : prev))
}

export function formatAudioFormats(formats: any[]): any[] {
  return Object.values(
    formats
      .filter((f) => ['mp3', 'm4a', 'webm'].includes(f.audio_ext) && f.acodec !== 'none')
      .reduce(
        (acc, f) => {
          const label = `${f.audio_ext} ${formatAbr(f.abr)}kbps`
          if (!acc[label] || (f.filesize_approx && (acc[label].filesize_approx ?? 0) < f.filesize_approx)) {
            acc[label] = {
              id: f.format_id,
              label: label,
              size: formatSize(f.filesize_approx),
              resolution: f.format_note,
              filesize_approx: f.filesize_approx,
            }
          }
          return acc
        },
        {} as Record<string, any>,
      ),
  ).sort((a: any, b: any) => (b.filesize_approx ?? 0) - (a.filesize_approx ?? 0))
}

export function formatSubtitles(subtitles: any): any[] {
  return Object.entries(subtitles)
    .filter(([_, arr]) => Array.isArray(arr) && arr.length > 0)
    .map(([lang, arr]: any) => ({ [lang]: arr[0].name }))
}

export function formatViewCount(viewCount: number): string {
  if (viewCount >= 1_000_000_000) return `${viewCount / 1_000_000_000}B views`
  else if (viewCount >= 1_000_000) return `${viewCount / 1_000_000}M views`
  else if (viewCount >= 1_000) return `${viewCount / 1_000}K views`
  else if (viewCount >= 1) return `${viewCount} views`
  else return '0 views'
}
