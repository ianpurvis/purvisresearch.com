import { expect } from '@jest/globals'

export function toContainMatch(actual, expected) {
  expect(actual).toContainEqual(expect.objectContaining(expected))
  return { pass: true }
}
