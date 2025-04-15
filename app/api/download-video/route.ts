import { type NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import { downloadService } from '@/lib/download.service'
import os from 'os'
import path from 'path'
import { sanitizeFilename } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { contentId, formatId, options } = await request.json()
    if (!contentId || !formatId)
      return NextResponse.json({ error: 'Content id and format id are required' }, { status: 400 })

    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    downloadService
      .downloadVideo(contentId, formatId, options, async (stats) => {
        await writer.write(encoder.encode(`data: ${JSON.stringify(stats)}\n\n`))
      })
      .catch(async (error) => {
        console.error('Download failed:', error)
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`))
      })
      .finally(async () => {
        await writer.close()
      })

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('Download error:', error)
    return NextResponse.json({ error: error.message || 'Failed to process download request' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    let filename = searchParams.get('filename')
    if (!filename) return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
    filename = sanitizeFilename(filename)
    const tempDir = path.join(os.tmpdir(), 'youtube-downloader')
    const files = fs.readdirSync(tempDir)
    const matchingFile = files.find((file) => file.startsWith(filename))
    if (!matchingFile) return NextResponse.json({ error: 'File not found' }, { status: 404 })

    const actualPath = path.join(tempDir, matchingFile)
    const actualFilename = path.basename(actualPath)
    const stats = await fs.promises.stat(actualPath)
    const fileStream = fs.createReadStream(actualPath)

    const stream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk))
        fileStream.on('end', async () => {
          controller.close()
          await downloadService.cleanup()
        })
        fileStream.on('error', async (err) => {
          controller.error(err)
          await downloadService.cleanup()
        })
      },
      cancel: async (reason) => {
        console.log('Stream cancelled:', reason)
        fileStream.destroy()
        await downloadService.cleanup()
      },
    })
    const encodedFilename = encodeURIComponent(actualFilename)

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
        'Content-Length': stats.size.toString(),
      },
    })
  } catch (error: any) {
    console.error('File serving error:', error)
    return NextResponse.json({ error: error.message || 'Failed to serve file' }, { status: 500 })
  }
}
