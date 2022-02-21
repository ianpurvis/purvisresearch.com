import { sin, cos } from '~/models/oscillators.js'

describe('sin(t)', () => {
  it('returns the sine of t * 2PI', () => {
    expect(sin(0.00)).toBeCloseTo(0)
    expect(sin(0.25)).toBeCloseTo(1)
    expect(sin(0.50)).toBeCloseTo(0)
    expect(sin(0.75)).toBeCloseTo(-1)
    expect(sin(1.00)).toBeCloseTo(0)
    expect(sin(1.25)).toBeCloseTo(1)
    expect(sin(1.50)).toBeCloseTo(0)
    expect(sin(1.75)).toBeCloseTo(-1)
    expect(sin(2.00)).toBeCloseTo(0)
  })
})

describe('cos(t)', () => {
  it('returns the cosine of t * 2PI', () => {
    expect(cos(0.00)).toBeCloseTo(1)
    expect(cos(0.25)).toBeCloseTo(0)
    expect(cos(0.50)).toBeCloseTo(-1)
    expect(cos(0.75)).toBeCloseTo(0)
    expect(cos(1.00)).toBeCloseTo(1)
    expect(cos(1.25)).toBeCloseTo(0)
    expect(cos(1.50)).toBeCloseTo(-1)
    expect(cos(1.75)).toBeCloseTo(0)
    expect(cos(2.00)).toBeCloseTo(1)
  })
})
