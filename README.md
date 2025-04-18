# YouTube Downloader 🎬

A web application built with Next.js that allows you to download YouTube videos and playlists with various customization options.


https://github.com/user-attachments/assets/65407e96-5302-40fc-8559-4b42023b5eb2


## ✨ Features

- **Download Videos & Playlists**: Paste a YouTube video or playlist URL to fetch content.
- **Format Selection**: Choose separate video and audio formats (e.g., 1080p video + best audio).
- **Audio-Only Downloads**: Easily download just the audio track in MP3 format.
- **Playlist Management**:
  - Search within playlist videos.
  - Select/deselect specific videos to download.
  - Download selected videos as a single ZIP archive.
- **Advanced Options**:
  - Customize output filename (or template for playlists).
  - Embed thumbnail.
  - Embed metadata.
  - Embed chapters.
  - Embed subtitles (choose from available languages).
- **Real-time Progress**: See download progress updates via Server-Sent Events.
- **Dark/Light Mode**: Toggle between themes.
- **Responsive Design**: Works on various screen sizes.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **YouTube Interaction (Backend)**: [yt-dlp](https://github.com/yt-dlp/yt-dlp) (via Node.js `child_process`)
- **YouTube Interaction (Frontend/Metadata)**: youtubei.js
- **Packaging (Playlists)**: archiver
- **State Management**: React Hooks (`useState`, `useEffect`) + Custom Hooks
- **Deployment**: Vercel (Recommended)

## 🔧 Getting Started

### Prerequisites

- Node.js (v18.18 or later recommended)
- pnpm (or npm/yarn)
- **`yt-dlp`**: You need to have `yt-dlp` installed and accessible in your system's PATH. Follow the official installation guide.
- **`ffmpeg`**: Required by `yt-dlp` for merging formats and embedding data. Ensure `ffmpeg` is installed and in your PATH. Follow the official installation guide.

### Installation & Running

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/youtube-downloader.git
    cd youtube-downloader
    ```

    _(Replace `your-username` with your actual GitHub username)_

2.  **Install dependencies:**

    ```bash
    pnpm install
    # or
    # npm install
    # or
    # yarn install
    ```

3.  **Run the development server:**

    ```bash
    pnpm dev
    # or
    # npm run dev
    # or
    # yarn dev
    ```

4.  Open http://localhost:3000 with your browser to see the result.

## ⚙️ API Endpoints

The application uses Next.js API Routes to handle backend operations:

- `/api/fetch-video`: Fetches metadata for a single video.
- `/api/fetch-playlist`: Fetches metadata for a playlist.
- `/api/download-video`: Handles downloading a single video and streaming progress/file.
- `/api/download-playlist`: Handles downloading multiple videos from a playlist, zipping them, and streaming progress/file.

_(Note: The download endpoints use a two-step process: POST to initiate and stream progress, then GET to retrieve the final file.)_

## ☁️ Deploy on Vercel

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

**Important:** Deploying this application requires a server environment where `yt-dlp` and `ffmpeg` can be executed. Standard Vercel serverless functions might not support this directly due to execution limitations or missing binaries. You might need to explore Vercel Hobby plan (if limitations allow) or alternative hosting solutions that provide more control over the execution environment (like a VPS or container-based services).

Check out the Next.js deployment documentation for more details.

## ⚖️ Disclaimer

This tool is intended for personal use only. Please respect YouTube's Terms of Service and copyright laws. Downloading copyrighted material without permission may be illegal in your country. The developers assume no responsibility for misuse of this tool.
