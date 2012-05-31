module.exports = exports = MC

function MC () {
  this.loading = 0
  this.models = {}
  this.ondone = function () {}
}

var modelLoaders = {}
MC.model = function (name, loader) {
  if (MC.prototype.hasOwnProperty(name) ||
      name === 'loading' ||
      name === 'ondone' ||
      name === 'error' ||
      name === 'models') {
    throw new Error('invalid model name: ' + name)
  }
  modelLoaders[name] = loader
  return MC
}

MC.prototype.load = function (name) {
  if (!modelLoaders[name]) {
    throw new Error('Unknown model: ' + name)
  }
  if (this.error) return
  var a = new Array(arguments.length)
  for (var i = 1; i < arguments.length; i ++) {
    a[i-1] = arguments[i]
  }
  a[i-1] = next.bind(this)
  this.loading ++
  modelLoaders[name].apply(this, a)
  function next (er, data) {
    if (this.error) return
    this.error = er
    this[name] = this.models[name] = data

    this.loading --
    if ((er || this.loading === 0) && this.ondone) {
      this.ondone(this.error, this.models)
    }
  }
}

MC.prototype.end = function (cb) {
  this.ondone = cb
  if (this.loading === 0 || this.error) {
    this.ondone(this.error, this.models)
  }
}
