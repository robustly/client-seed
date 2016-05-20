

var config = require('../config')({component: 'unit-test'})
global.ioc = require('../setup')(config, null, {})

// TODO: Register all mocks here:
ioc.register('serviceOne', function() {
  return {
    interfaceOne: sinon.stub().returns(11)
  }
})
