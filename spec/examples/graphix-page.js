import { expect, it } from 'jest-ctx'
import { MESSAGE_NO_WEBGL } from '~/models/webgl.js'
import { describePage } from './page.js'

export function describeGraphixPage(
  Page,
  metadata,
  name = 'as a graphix page',
  fn = () => {}
) {
  describePage(Page, metadata, name, () => {

    it('warns if webgl is not available', () => {
      expect(console.warn).toHaveBeenCalledWith(MESSAGE_NO_WEBGL)
    })

    fn()
  })
}
