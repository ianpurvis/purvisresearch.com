import { jest } from '@jest/globals'
import { afterAll, beforeAll, beforeEach } from 'jest-ctx'

export function mockConsole(fn = () => {}) {
  let real
  let mock

  beforeAll(() => {
    real = console

    mock = {}
    for (const key in console) {
      mock[key] = jest.fn()
    }

    globalThis.console = mock
  })

  beforeEach(() => {
    console.warn.mockClear()
  })

  fn()

  afterAll(() => {
    globalThis.console = real
  })
}
