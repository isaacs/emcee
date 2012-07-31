var MC = require('../emcee.js')
var tap = require('tap')
var fs = require('fs')

MC.model('file', function (f, cb) {
  fs.readFile(f, cb)
})

MC.model('utf8', function (f, cb) {
  fs.readFile(f, 'utf8', cb)
})

MC.model('sync', function (cb) {
  cb(null, 2 + 2)
})

tap.test('read the file', function (t) {
  var m = new MC()
  m.load('file', __filename)
  m.end(function (er, models) {
    t.ifError(er)
    if (er) return t.end()
    t.ok(models.file)
    t.equal(models.file.toString(),
            fs.readFileSync(__filename, 'utf8'))
    t.end()
  })
})

tap.test('model fail', function (t) {
  var m = new MC()
  m.load('file', __dirname)
  m.end(function (er, models) {
    t.ok(er)
    t.equal(models.file, undefined)
    t.end()
  })
})

tap.test('multiple', function (t) {
  var m = new MC()
  m.load('file', __filename)
  m.load('utf8', __filename)
  m.load('sync')
  m.end(function (er, models) {
    t.ifError(er)
    if (er) return t.end()
    t.equal(models.sync, 4)
    t.equal(models.file.toString(), models.utf8)
    t.end()
  })
})

tap.test('aliasing', function (t) {
  var m = new MC()
  m.load('file', __filename)
  m.loadAs('file', 'otherfile', __filename)
  m.end(function (er, models) {
    if (er) throw er
    t.same(models.file, models.otherfile)
    t.end()
  })
})
