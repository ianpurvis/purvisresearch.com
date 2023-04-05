import { diff } from 'jest-diff'

const { keys } = Object
const { stringify } = JSON

function isMatch(a, b) {
  return keys(a).every(key => stringify(a[key]) == stringify(b[key]))
}

export function toContainMatch(received, expected) {
  const pass = received.some(element => isMatch(expected, element))
  const message = () => diff([expected], received)
  return { message, pass }
}
