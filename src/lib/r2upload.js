/**
 * Client-side file validation utilities for submission forms.
 * Files are uploaded server-side (FastAPI → R2) — only validation happens here.
 */

const ALLOWED_AUDIO_EXTS = ['.wav', '.mp3', '.flac']
const ALLOWED_AUDIO_TYPES = [
  'audio/wav', 'audio/x-wav', 'audio/wave',
  'audio/mpeg',
  'audio/flac', 'audio/x-flac',
  'audio/octet-stream',
]

/**
 * Validate cover art file.
 * Resolves on pass, rejects with a human-readable error string.
 * Rules: JPEG or PNG, exactly 3000×3000 px.
 */
export function validateCoverArt(file) {
  if (!file) return Promise.reject('Cover art is required.')
  const allowed = ['image/jpeg', 'image/png', 'image/jpg']
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  if (!allowed.includes(file.type) && !['.jpg', '.jpeg', '.png'].includes(ext)) {
    return Promise.reject('Cover art must be a JPEG or PNG image.')
  }
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      if (img.width !== 3000 || img.height !== 3000) {
        reject(`Cover art must be exactly 3000×3000 px (yours is ${img.width}×${img.height} px).`)
      } else {
        resolve(null)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject('Could not read image. Please try a different file.')
    }
    img.src = url
  })
}

/**
 * Validate audio file type (WAV / MP3 / FLAC only).
 * Returns an error string, or null on pass.
 */
export function validateAudioFile(file) {
  if (!file) return 'Audio file is required.'
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  if (!ALLOWED_AUDIO_TYPES.includes(file.type) && !ALLOWED_AUDIO_EXTS.includes(ext)) {
    return 'Audio must be a WAV, MP3, or FLAC file.'
  }
  return null
}
