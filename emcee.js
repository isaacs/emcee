module.exports = exports = MC

function MC () {
  this._loading = 0
  this.models = {}
}

var modelLoaders = {}
MC.model = function (name, loader) {
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
  this._loading ++
  modelLoaders[name].apply(this, a)
  function next (er, data) {
    if (this.error) return
    this.error = er
    this.models[name] = data

    this._loading --
    if (er || this._loading === 0) {
      this.ondone(this.error, this.models)
    }
  }
}

MC.prototype.end = function (cb) {
  this.ondone = cb
  if (this._loading === 0) this.ondone(this.error, this.models)
}
