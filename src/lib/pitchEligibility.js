// Playlist pitching window: a submission is only pitchable once it has been
// sitting in the system for 30 days ("upload 30 days in advance"), and stops
// being pitchable the day its release date arrives.
const PITCH_ELIGIBLE_TYPES = new Set(['new_song', 'new_album'])
const MIN_DAYS_BEFORE_PITCH = 30

export function isPitchEligible(submission) {
  if (submission.status !== 'approved') return false
  if (!PITCH_ELIGIBLE_TYPES.has(submission.submission_type)) return false

  const goLiveDate = submission.data?.go_live_date
  if (!goLiveDate) return false

  const now = new Date()
  const createdAt = new Date(submission.created_at)
  const daysSinceSubmit = (now - createdAt) / (1000 * 60 * 60 * 24)
  if (daysSinceSubmit < MIN_DAYS_BEFORE_PITCH) return false

  // go_live_date is a plain "YYYY-MM-DD" — compare by local calendar date, not time-of-day
  const todayStr = now.toISOString().slice(0, 10)
  if (todayStr >= goLiveDate) return false

  return true
}
