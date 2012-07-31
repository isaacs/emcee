# emcee

A model loader that a controller calls.  Basically, just the M and C
bits of MVC.

An interface for controllers to specify that certain models will be
needed, and then have them get loaded.

## Usage

```javascript
var MC = require('emcee')

// add a bunch of models
MC.model('login', function (req, cb) {
  // callback is called with (er, data)
  req.session.get('login', cb)
})

MC.model('train', function (url, res, cb) {
  
})

// later on...

http.createServer(function (req, res) {
  // check if the user is logged in.
  var m = new MC()

  // modelname, args...
  m.load('login', req)
  m.load('bike', req.url, res)
  // different kind of bike: modelname, alias, args...
  m.loadAs('bike', 'motorbike', 'dirt', 'roads')

  m.end(function (er, models) {
    // either there is an error, or all models are loaded on the
    // 'models' object.  note that all errors are assumed to be
    // catastrophic, so you only get the first error, and the
    // models object will only contain the models that got loaded
    // before the error occurred.
  })
}).listen(1337)
```
