


module.exports = function(params) {
  return {
    logging: {
      component: params.component || 'unknown-test',
      app: params.app || 'module-base',
      env: params.env || 'test',
      debug: true
    }
  }
}
