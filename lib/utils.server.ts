import { spawn } from 'child_process'

export async function getVideoInfoById(args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn('yt-dlp', args)
    let stdout = ''
    ytdlp.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    ytdlp.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`yt-dlp exited with code ${code}`))
        return
      }
      try {
        const info = JSON.parse(stdout)
        resolve(info)
      } catch (error) {
        reject(error)
      }
    })
  })
}

export async function getPlaylistInfoById(args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn('yt-dlp', args)
    let stdout = ''
    ytdlp.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    ytdlp.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`yt-dlp exited with code ${code}`))
        return
      }
      try {
        const videoEntries = stdout
          .trim()
          .split('\n')
          .map((line) => JSON.parse(line))
        resolve(videoEntries)
      } catch (error) {
        reject(error)
      }
    })
  })
}
