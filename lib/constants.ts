export const VIDEO_FORMATS = [
  { id: 'bv', label: 'Best Video Quality Available' },
  { id: 'bv[height<=1080]', label: '1080p' },
  { id: 'bv[height<=720]', label: '720p' },
  { id: 'bv[height<=480]', label: '480p' },
]

export const AUDIO_FORMATS = [
  { id: 'ba', label: 'Best Audio Quality Available' },
  { id: 'ba[abr<=192]', label: '192kbps' },
  { id: 'ba[abr<=128]', label: '128kbps' },
  { id: 'ba[abr<=64]', label: '64kbps' },
]
