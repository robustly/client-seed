
var IOC = require('robust-ioc'),
  axios = require('axios'),
  riddler = require('riddler'),
  p = require('bluebird'),
  _ = require('lodash')

module.exports = function(config, log) {
  if (!log) {
    log = muzzledlog
  }

  return function(containerName) {
    var ioc = IOC({container: containerName, bail: true}, log)
    ioc.singleton('log', log)
    ioc.singleton('config', config)

    var axiosConfig = {
      baseURL: config.API_BASE,
      //timeout: 1000,
      headers: {}
    }

    if (config.userToken) axiosConfig.headers['USER_TOKEN'] = config.userToken

    var _http = axios.create(axiosConfig)

    ioc.singleton('_http', _http)
    ioc.singleton('p', p)
    ioc.singleton('_', _)
    ioc.singleton('riddler', riddler)
    ioc.register('client', require('./lib'))
    
    return ioc
  }
}

function muzzledlog() {}
muzzledlog.method = muzzledlog.module = muzzledlog.goal = function() {
  return muzzledlog
}
muzzledlog.info = muzzledlog.debug = muzzledlog.log = muzzledlog
muzzledlog.error = muzzledlog.warn = muzzledlog.fatal = console.error.bind(console, '[ISSUE]')
