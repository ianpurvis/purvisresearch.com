import { SECONDS_TO_MILLISECONDS } from '~/assets/javascripts/constants.js'

const delay = (seconds) => new Promise(resolve =>
  setTimeout(resolve, seconds * SECONDS_TO_MILLISECONDS)
)


export { delay }
