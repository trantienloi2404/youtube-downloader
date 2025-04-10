import { type NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import { downloadService } from '@/lib/download.service'

export async function POST(request: NextRequest) {
  try {
    const { contentId, formatId, options } = await request.json()
    if (!contentId || !formatId) {
      return NextResponse.json({ error: 'Content id and format id are required' }, { status: 400 })
    }

    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    // Start download in background
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
    return NextResponse.json(
      { error: error.message || 'Failed to process download request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const filePath = searchParams.get('filePath')
    
    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 })
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const stats = await fs.promises.stat(filePath)
    const fileStream = fs.createReadStream(filePath)

    const stream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk))
        fileStream.on('end', async () => {
          controller.close()
          await downloadService.cleanup(filePath)
        })
        fileStream.on('error', (err) => controller.error(err))
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filePath.split(/[\\/]/).pop()}"`,
        'Content-Length': stats.size.toString(),
      },
    })
  } catch (error: any) {
    console.error('File serving error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to serve file' },
      { status: 500 }
    )
  }
}
