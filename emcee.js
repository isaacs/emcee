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

MC.prototype.loadAs = function (name, alias) {
  if (!modelLoaders[name]) {
    throw new Error('Unknown model: ' + name)
  }
  if (this.error) return
  if (!alias) alias = name

  // [name, alias, args...] => [args..., cb]
  var a = new Array(arguments.length - 1)
  for (var i = 2; i < arguments.length; i ++) {
    a[i - 2] = arguments[i]
  }
  a[i - 2] = next.bind(this)

  this.loading ++
  modelLoaders[name].apply(this, a)
  function next (er, data) {
    if (this.error) return
    this.error = er
    this[alias] = this.models[alias] = data

    this.loading --
    if ((er || this.loading === 0) && this.ondone) {
      this.ondone(this.error, this.models)
    }
  }
}

MC.prototype.load = function (name) {
  var a = new Array(arguments.length + 1)
  a[0] = name
  for (var i = 0; i < arguments.length; i ++) {
    a[i+1] = arguments[i]
  }
  // a = [name, name, args...]

  return this.loadAs.apply(this, a)
}

MC.prototype.end = function (cb) {
  this.ondone = cb
  if (this.loading === 0 || this.error) {
    this.ondone(this.error, this.models)
  }
}
