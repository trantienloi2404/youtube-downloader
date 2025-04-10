import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { randomUUID } from 'crypto'

export interface DownloadOptions {
  embedThumbnail?: boolean
  embedChapter?: boolean
  embedMetadata?: boolean
  embedSubtitle?: boolean
  subtitleLanguage?: string
}

export interface DownloadStats {
  progress: number
  size: string
  speed: string
  eta: string
}

class DownloadService {
  private readonly tempDir: string

  constructor() {
    this.tempDir = path.join(os.tmpdir(), 'youtube-downloader')
    this.ensureTempDir()
  }

  private async ensureTempDir() {
    try {
      await fs.promises.mkdir(this.tempDir, { recursive: true })
    } catch (error) {
      console.error('Failed to create temp directory:', error)
      throw new Error('Failed to initialize download service')
    }
  }

  async downloadVideo(
    contentId: string,
    formatId: string,
    options: DownloadOptions,
    onProgress?: (stats: DownloadStats) => void
  ): Promise<string> {
    const uniqueId = randomUUID()
    const outputPath = path.join(this.tempDir, `${uniqueId}.%(ext)s`)
    const args = this.buildYtDlpArgs(contentId, formatId, outputPath, options)

    return new Promise((resolve, reject) => {
      const ytdlp = spawn('yt-dlp', args)
      let lastProgress = 0

      ytdlp.stdout.on('data', (data) => {
        const output = data.toString()
        const progressInfo = this.parseProgress(output)
        
        if (progressInfo && Math.abs(progressInfo.progress - lastProgress) >= 2) {
          lastProgress = progressInfo.progress
          onProgress?.(progressInfo)
        }
      })

      ytdlp.stderr.on('data', (data) => {
        console.error(`yt-dlp error: ${data}`)
      })

      ytdlp.on('close', async (code) => {
        if (code === 0) {
          try {
            const files = await fs.promises.readdir(this.tempDir)
            const downloadedFile = files.find(file => file.startsWith(uniqueId))
            if (downloadedFile) {
              resolve(path.join(this.tempDir, downloadedFile))
            } else {
              reject(new Error('Download completed but file not found'))
            }
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error(`Download failed with code ${code}`))
        }
      })
    })
  }

  private buildYtDlpArgs(contentId: string, formatId: string, outputPath: string, options: DownloadOptions): string[] {
    const args = [
      '-f', formatId,
      contentId,
      '-o', outputPath,
      '--no-warnings',
      '--merge-output-format', 'mp4'
    ]

    if (options.embedThumbnail) args.push('--embed-thumbnail')
    if (options.embedChapter) args.push('--embed-chapters')
    if (options.embedMetadata) args.push('--embed-metadata')
    if (options.embedSubtitle && options.subtitleLanguage) {
      args.push('--embed-subs', '--sub-langs', options.subtitleLanguage)
    }

    return args
  }

  private parseProgress(output: string): DownloadStats | null {
    const progressRegex = /(\d+\.\d+)%.*?of\s+(.*?)\s+at\s+(.*?)\s+ETA\s+(.*?)$/
    const match = progressRegex.exec(output)

    if (match) {
      return {
        progress: parseFloat(match[1]),
        size: match[2],
        speed: match[3],
        eta: match[4]
      }
    }

    return null
  }

  async cleanup(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath)
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }
}

export const downloadService = new DownloadService()