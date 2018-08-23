export default class Demo {

  constructor() {
  }

  get element() {
    return null
  }

  dispose() {
  }

  load() {
    console.debug("PR: Loading graphics...")
    return Promise.resolve(this)
  }

  render() {
  }

  update() {
  }
}
