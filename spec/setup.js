import { expect } from 'jest-ctx'
import * as matchers from './matchers.js'

expect.extend(matchers)

import * as globals from 'jest-ctx'
Object.assign(globalThis, globals)
