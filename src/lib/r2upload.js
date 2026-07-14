/**
 * R2 upload utilities — file validation + presigned-PUT upload flow.
 * All heavy file handling is done client-side before the form submits.
 */

const BASE = 'https://backend1-xzx5.onrender.com'

const ALLOWED_AUDIO_EXTS = ['.wav', '.mp3', '.flac']
const ALLOWED_AUDIO_TYPES = [
  'audio/wav', 'audio/x-wav', 'audio/wave',
  'audio/mpeg',
  'audio/flac', 'audio/x-flac',
  'audio/octet-stream', // some browsers report this for wav/flac
]

/**
 * Validate cover art file.
 * Resolves on pass, rejects with a human-readable error string.
 * Checks: JPEG/PNG type, exactly 3000×3000 px.
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
 * Returns an error string or null on pass.
 */
export function validateAudioFile(file) {
  if (!file) return 'Audio file is required.'
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  if (!ALLOWED_AUDIO_TYPES.includes(file.type) && !ALLOWED_AUDIO_EXTS.includes(ext)) {
    return 'Audio must be a WAV, MP3, or FLAC file.'
  }
  return null
}

/**
 * Upload a file directly to R2 via a presigned PUT URL.
 *
 * @param {File} file
 * @param {{ artistName, releaseName, fileType, trackNumber? }} opts
 * @param {(pct: number) => void} [onProgress]  0–100 progress callback
 * @returns {Promise<string>} R2 object key
 */
export async function uploadToR2(file, { artistName, releaseName, fileType, trackNumber = null }, onProgress) {
  // 1. Get presigned PUT URL from backend
  const presignRes = await fetch(`${BASE}/media/presign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      artist_name: artistName,
      release_name: releaseName,
      file_type: fileType,
      content_type: file.type || 'application/octet-stream',
      file_name: file.name,
      track_number: trackNumber,
    }),
  })
  if (!presignRes.ok) {
    const err = await presignRes.json().catch(() => ({}))
    throw new Error(err.detail || `Presign failed (${presignRes.status})`)
  }
  const { upload_url: uploadUrl, key } = await presignRes.json()

  // 2. PUT to R2 with progress tracking
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
      })
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve()
      else reject(new Error(`R2 upload failed (HTTP ${xhr.status})`))
    }
    xhr.onerror = () => reject(new Error('Network error during file upload.'))
    xhr.ontimeout = () => reject(new Error('Upload timed out.'))
    xhr.send(file)
  })

  return key
}
