import { afterAll, beforeAll, jest } from '@jest/globals'

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
