


module.exports = function(params) {
  params = params || {}
  return {
    logging: {
      component: params.component || 'api-tests',
      app: params.app || 'module-base',
      env: params.env || 'test',
      debug: true
    },
    API_BASE: 'http://localhost:9000/api/'
  }
}
