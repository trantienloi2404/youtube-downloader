# YouTube Downloader 🎬

A modern web application built with Next.js that allows you to download YouTube videos and playlists with various customization options. Features a beautiful UI with real-time progress tracking and download cancellation.

![YouTube Downloader](https://github.com/user-attachments/assets/65407e96-5302-40fc-8559-4b42023b5eb2)

## ✨ Features

- **Download Videos & Playlists**: Paste a YouTube video or playlist URL to fetch content
- **Format Selection**: Choose separate video and audio formats (e.g., 1080p video + best audio)
- **Audio-Only Downloads**: Easily download just the audio track in MP3 format
- **Playlist Management**:
  - Search within playlist videos
  - Select/deselect specific videos to download
  - Download selected videos as a single ZIP archive
- **Advanced Options**:
  - Customize output filename (or template for playlists)
  - Embed thumbnail, metadata, chapters, and subtitles
  - Choose subtitle languages
- **Real-time Progress**: See download progress updates via Server-Sent Events
- **Download Cancellation**: Cancel ongoing downloads at any time with the cancel button
- **Automatic Cleanup**: Downloads are automatically cancelled if the browser tab is closed
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on various screen sizes

## 🚀 Quick Start

### Option 1: Docker (Recommended)

The easiest way to get started is using Docker, which includes all dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/youtube-downloader.git
cd youtube-downloader

# Build and run with Docker
docker build -t youtube-downloader .
docker run -p 3000:3000 youtube-downloader

# Or use docker-compose
docker-compose up -d
```

Open http://localhost:3000 in your browser.

### Option 2: Local Development

#### Prerequisites

1. **Node.js** (v18.18 or later)
2. **pnpm** (or npm/yarn)
3. **yt-dlp** (see installation instructions below)
4. **ffmpeg** (see installation instructions below)

#### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/youtube-downloader.git
   cd youtube-downloader
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Install yt-dlp and ffmpeg** (see detailed instructions below)

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. Open http://localhost:3000 in your browser

## 📦 Installing yt-dlp

### Windows

#### Method 1: Using winget (Windows 10/11)
```bash
winget install yt-dlp
```

#### Method 2: Using Chocolatey
```bash
choco install yt-dlp
```

#### Method 3: Manual Installation
1. Download the latest release from [yt-dlp releases](https://github.com/yt-dlp/yt-dlp/releases)
2. Extract `yt-dlp.exe` to a folder (e.g., `C:\yt-dlp\`)
3. Add the folder to your system PATH:
   - Open System Properties → Advanced → Environment Variables
   - Edit the `Path` variable and add `C:\yt-dlp\`

#### Method 4: Using pip
```bash
pip install yt-dlp
```

### macOS

#### Method 1: Using Homebrew (Recommended)
```bash
brew install yt-dlp
```

#### Method 2: Using MacPorts
```bash
sudo port install yt-dlp
```

#### Method 3: Using pip
```bash
pip3 install yt-dlp
```

### Linux

#### Ubuntu/Debian
```bash
# Using apt (may be outdated)
sudo apt update
sudo apt install yt-dlp

# Using pip (recommended for latest version)
sudo pip3 install yt-dlp
```

#### CentOS/RHEL/Fedora
```bash
# Fedora
sudo dnf install yt-dlp

# CentOS/RHEL
sudo yum install yt-dlp

# Using pip
sudo pip3 install yt-dlp
```

#### Arch Linux
```bash
sudo pacman -S yt-dlp
```

#### Using pip (All Linux distributions)
```bash
sudo pip3 install yt-dlp
```

### Verify Installation
```bash
yt-dlp --version
```

## 🎥 Installing ffmpeg

### Windows

#### Method 1: Using winget
```bash
winget install ffmpeg
```

#### Method 2: Using Chocolatey
```bash
choco install ffmpeg
```

#### Method 3: Manual Installation
1. Download from [ffmpeg.org](https://ffmpeg.org/download.html#build-windows)
2. Extract to a folder (e.g., `C:\ffmpeg\`)
3. Add `C:\ffmpeg\bin` to your system PATH

### macOS

#### Using Homebrew
```bash
brew install ffmpeg
```

#### Using MacPorts
```bash
sudo port install ffmpeg
```

### Linux

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

#### CentOS/RHEL/Fedora
```bash
# Fedora
sudo dnf install ffmpeg

# CentOS/RHEL
sudo yum install ffmpeg
```

#### Arch Linux
```bash
sudo pacman -S ffmpeg
```

### Verify Installation
```bash
ffmpeg -version
```

## 🐳 Docker Setup

### Dockerfile
The project includes a Dockerfile that automatically installs all dependencies:

```dockerfile
FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    && pip3 install yt-dlp

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
```

### Docker Compose
Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  youtube-downloader:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./downloads:/app/downloads
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Running with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **YouTube Download**: [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- **Media Processing**: [ffmpeg](https://ffmpeg.org/)
- **Packaging**: [archiver](https://www.npmjs.com/package/archiver)
- **State Management**: React Hooks + Custom Hooks
- **Deployment**: Vercel, Docker, or any Node.js hosting

## 📡 API Endpoints

The application uses Next.js API Routes:

- `GET /api/fetch-video` - Fetch video metadata
- `GET /api/fetch-playlist` - Fetch playlist metadata
- `POST /api/download-video` - Initiate video download with progress streaming
- `GET /api/download-video` - Retrieve downloaded video file
- `POST /api/download-playlist` - Initiate playlist download with progress streaming
- `GET /api/download-playlist` - Retrieve downloaded playlist ZIP file

## 🚀 Deployment

### Vercel Deployment

1. **Fork/clone the repository**
2. **Connect to Vercel**:
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

3. **Set environment variables** (if needed)
4. **Deploy**

**Note**: Vercel serverless functions have limitations for running `yt-dlp` and `ffmpeg`. Consider using:
- Vercel Hobby plan with longer function timeouts
- Alternative hosting (Railway, Render, DigitalOcean)
- Self-hosted VPS

### Railway Deployment

1. **Connect your GitHub repository**
2. **Set build command**: `pnpm build`
3. **Set start command**: `pnpm start`
4. **Add environment variables** (if needed)

### Self-Hosted VPS

1. **Clone and install dependencies**
2. **Install yt-dlp and ffmpeg** (see installation guides above)
3. **Set up PM2 or similar process manager**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "youtube-downloader" -- start
   pm2 startup
   pm2 save
   ```

## 🔧 Development

### Project Structure
```
youtube-downloader/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── downloader/        # Download-related components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and services
├── public/               # Static assets
└── Dockerfile            # Docker configuration
```

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript type checking

# Docker
docker build .    # Build Docker image
docker run -p 3000:3000 youtube-downloader  # Run container
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Disclaimer

This tool is intended for personal use only. Please respect YouTube's Terms of Service and copyright laws. Downloading copyrighted material without permission may be illegal in your country. The developers assume no responsibility for misuse of this tool.

## 🆘 Troubleshooting

### Common Issues

**"yt-dlp not found"**
- Ensure yt-dlp is installed and in your PATH
- Try running `yt-dlp --version` in terminal
- Restart your terminal after installation

**"ffmpeg not found"**
- Ensure ffmpeg is installed and in your PATH
- Try running `ffmpeg -version` in terminal
- Restart your terminal after installation

**Download fails**
- Check your internet connection
- Verify the YouTube URL is valid
- Check if the video/playlist is available in your region
- Try updating yt-dlp: `pip install --upgrade yt-dlp`

**Docker issues**
- Ensure Docker is running
- Check Docker logs: `docker-compose logs`
- Rebuild the image: `docker-compose build --no-cache`

### Getting Help

- Check the [Issues](https://github.com/your-username/youtube-downloader/issues) page
- Create a new issue with detailed information
- Include your operating system, Node.js version, and error messages
