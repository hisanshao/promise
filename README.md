##sync

```javascript
new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(11) // or reject(11)
  })
})
.then(function (res) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(res)
    })
  })
}, function (error) { console.log(error) })
.then(function (res) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(res)
    })
  })
}, function (error) { console.log(error) })
.then(function (res) {
  console.log(res) // 11
}, function (error) { console.log(error) })
```
##race

```javascript
Promise.race([
  new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(11)
    }, 5000)
  }),
  new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(22)
    }, 2000)
  }),
  new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(33)
    }, 4000)
  }),
  new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(44)
    }, 3000)
  })
])
.then(function (res) {
  console.log(res) // 22
}, function (error) { console.log(error) })
```

##async

```javascript
Promise.all([
  new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(11)
    }, 5000)
  }),
  new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(22)
    }, 2000)
  }),
  new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(33)
    }, 4000)
  }),
  new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(44)
    }, 3000)
  })
])
.then(function (res) {
  console.log(res) // [11,22,33,44]
}, function (error) { console.log(error) })
```