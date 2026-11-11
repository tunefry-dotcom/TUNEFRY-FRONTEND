import { describe, it, expect } from 'vitest'
import { PLANS, offerAmount, DIWALI_PCT } from '../src/data/plans.jsx'

const byId = (id) => PLANS.find((p) => p.id === id)

describe('Diwali offer on the plan catalogue', () => {
  it('is 10%', () => {
    expect(DIWALI_PCT).toBe(10)
  })

  it('discounts every paid plan and keeps the list price as strike-through', () => {
    const expected = {
      'single-song': ['269', '₹299'],
      starter: ['899', '₹999'],
      'single-artist': ['1,439', '₹1,599'],
      'double-artist': ['2,699', '₹2,999'],
      label: ['6,299', '₹6,999'],
    }
    for (const [id, [price, strike]] of Object.entries(expected)) {
      expect(byId(id).price).toBe(price)
      expect(byId(id).priceStrike).toBe(strike)
      expect(byId(id).offerPct).toBe(10)
    }
  })

  it('leaves the Free plan untouched', () => {
    const free = byId('free')
    expect(free.price).toBe('0')
    expect(free.priceStrike).toBeUndefined()
    expect(free.offerBadge).toBeUndefined()
  })

  it('offerAmount matches the backend floor rounding', () => {
    expect(offerAmount(299)).toBe(269) // 269.1 -> 269
    expect(offerAmount(1260)).toBe(1134)
    expect(offerAmount(0)).toBe(0)
  })
})
