const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function Promise (func) {
  if (typeof func !== 'function') {
    throw new TypeError('Promise argument error:' + func.toString())
  }
  let _this = this
  _this.status = PENDING
  _this.data = undefined
  _this.resolveCallbacks = []
  _this.rejectCallbacks = []

  _this.resolve = function (value) {
    if (_this.status !== PENDING) return
    _this.status = RESOLVED
    _this.data = value
    _this.resolveCallbacks.map(function (resolveCallback, i) {
      resolveCallback(value)
    })
  }

  _this.reject = function (reason) {
    if (_this.status !== PENDING) return
    _this.status = REJECTED
    _this.data = reason
    _this.rejectCallbacks.map(function (rejectCallback, i) {
      rejectCallback(reason)
    })
  }
  func(_this.resolve, _this.reject)
}

Promise.prototype.then = function (resolveCallback, rejectCallback) {
  let _this = this
  resolveCallback = typeof resolveCallback === 'function' ? resolveCallback : function (value) { return value }
  rejectCallback = typeof rejectCallback === 'function' ? rejectCallback : function (reason) { return reason }

  if (_this.status === PENDING) {
    return new Promise (function (resolve, reject) {
      _this.resolveCallbacks.push(function (value) {
        try {
          let x = resolveCallback(_this.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })

      _this.rejectCallbacks.push(function (reason) {
        try {
          let x = rejectCallback(_this.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  if (_this.status === RESOLVED) {
    return new Promise (function (resolve, reject) {
      try {
        let x = resolveCallback(_this.data)
        if (x instanceof Promise) {
          x.then(resolve, reject)
        } else {
          resolve(x)
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  if (_this.status === REJECTED) {
    return new Promise (function (resolve, reject) {
      try {
        let x = rejectCallback(_this.data)
        if (x instanceof Promise) {
          x.then(resolve, reject)
        }
      } catch (e) {
        reject(e)
      }
    })
  }
}

Promise.race = function (promises) {
  if (Object.prototype.toString.call(promises) !== '[object Array]') {
    throw new TypeError('Promise argument error:' + promises.toString())
  }
  return new Promise(function (resolve, reject) {
    promises.forEach(function (primiseCallback) {
      primiseCallback.then(resolve, reject)
    })
  })
}

Promise.all = function (promises) {
  if (Object.prototype.toString.call(promises) !== '[object Array]') {
    throw new TypeError('Promise argument error:' + promises.toString())
  }
  return new Promise(function (resolve, reject) {
    let results = []
    let count = promises.length
    promises.map(function (primiseCallback, i) {
      primiseCallback.then(function (value) {
        count--
        results[i] = value
        if (count === 0) {
          resolve(results)
        }
      }, reject)
    })
  })
}
module.exports = Promise

