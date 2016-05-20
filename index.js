var __namespace__ = 'ClientBase'

function ClientBase() {}
var Setup = require('./setup')

/**
 * example - this module has an exampleAPI method that does nothing.
 *
 * @param  {type} config       description
 * @param  {type} log          description
 * @return {type}              description
 */
module.exports = function(config, log) {
  var _log = log.module(__namespace__, {config: config})
  var m = new ClientBase()

  // ModuleConfig V1.0 Compliancy
  if (!config) throw Error(__namespace__+': missing config.')
  if (config[__namespace__]) {
    config = config[__namespace__]
  }

  var ioc = Setup(config, log)(__namespace__)
  var client = ioc.get('client')

  m.api = function(a,b) {
    log = _log.method('api', {a: a, b:b})
    return client.api(a,b)
      .then(log.result)
      .catch(log.fail)
  }

  return m
}
