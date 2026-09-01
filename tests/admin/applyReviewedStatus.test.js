import { describe, it, expect } from 'vitest'
import { applyReviewedStatus } from '../../src/pages/admin/SecretPanel.jsx'

const makeList = () => [
  { id: 'a', title: 'Song A', status: 'pending' },
  { id: 'b', title: 'Song B', status: 'pending' },
  { id: 'c', title: 'Song C', status: 'pending' },
]

describe('applyReviewedStatus', () => {
  it('updates the status of the matching item and stamps reviewed_at', () => {
    const result = applyReviewedStatus(makeList(), 'b', 'approved', '2026-09-01T00:00:00.000Z')
    const updated = result.find((s) => s.id === 'b')
    expect(updated.status).toBe('approved')
    expect(updated.reviewed_at).toBe('2026-09-01T00:00:00.000Z')
  })

  it('does NOT reorder the list — approved/declined items stay at their original index', () => {
    const before = makeList()
    const result = applyReviewedStatus(before, 'b', 'approved')
    expect(result.map((s) => s.id)).toEqual(['a', 'b', 'c'])
  })

  it('keeps position stable across multiple reviews in any order', () => {
    let list = makeList()
    list = applyReviewedStatus(list, 'c', 'declined')
    list = applyReviewedStatus(list, 'a', 'approved')
    expect(list.map((s) => s.id)).toEqual(['a', 'b', 'c'])
    expect(list.map((s) => s.status)).toEqual(['approved', 'pending', 'declined'])
  })

  it('leaves items other than the target untouched', () => {
    const before = makeList()
    const result = applyReviewedStatus(before, 'a', 'approved')
    expect(result[1]).toEqual(before[1])
    expect(result[2]).toEqual(before[2])
  })

  it('does not mutate the original array', () => {
    const before = makeList()
    const beforeSnapshot = JSON.parse(JSON.stringify(before))
    applyReviewedStatus(before, 'a', 'approved')
    expect(before).toEqual(beforeSnapshot)
  })

  it('is a no-op reorder when id is not found (list shape unchanged)', () => {
    const before = makeList()
    const result = applyReviewedStatus(before, 'nonexistent', 'approved')
    expect(result.map((s) => s.id)).toEqual(['a', 'b', 'c'])
    expect(result.map((s) => s.status)).toEqual(['pending', 'pending', 'pending'])
  })
})
