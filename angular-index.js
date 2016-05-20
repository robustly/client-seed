
angular.module('ClientBase', [])
  .service('clientbase', ['config', 'log', function(config, log) {
    log('Config:', config)
    return require('./index')(config,log)
  }])
