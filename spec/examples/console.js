import { jest } from '@jest/globals'
import { afterAll, beforeAll } from 'jest-ctx'

export function mockConsole() {
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

  afterAll(() => {
    globalThis.console = real
  })
}
