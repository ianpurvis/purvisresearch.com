import { expect } from 'jest-ctx'
import * as matchers from './matchers.js'

expect.extend(matchers)

import { jest } from '@jest/globals'
jest.mock('#imports', () => ({
  useHead: jest.fn()
}))
