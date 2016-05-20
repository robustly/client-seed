
module.exports = function(params) {
  return {
    logging: {
      component: params.component || 'int-tests',
      app: params.app || 'module-base',
      env: params.env || 'test',
      debug: true
    }
  }
}
