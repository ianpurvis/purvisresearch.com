class Deferred extends Promise {

  constructor(executor) {
    let resolve, reject
    super((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
      if (executor) {
        executor(_resolve, _reject)
      }
    })
    Object.assign(this, { resolve, reject })
  }

  static get [Symbol.species]() {
    return Promise
  }
}

export { Deferred }
