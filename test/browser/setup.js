
angular.module('testsetup', [])
  .factory('config', [function() {
    return {}
  }])
  .factory('log', [function() {
    function muzzledlog() {}
    muzzledlog.method = muzzledlog.module = muzzledlog.goal = function() {
      return muzzledlog
    }
    muzzledlog.result = function(r) {return r}
    muzzledlog.fail = function(err) {throw err}
    muzzledlog.info = muzzledlog.debug = muzzledlog.log = muzzledlog
    muzzledlog.error = muzzledlog.warn = muzzledlog.fatal = console.error.bind(console, '[ISSUE]')
    return muzzledlog
  }])

beforeEach(module('testsetup'))
beforeEach(module('ClientBase'))

beforeEach(inject(function(_clientbase_){
  window.m = _clientbase_
}))
