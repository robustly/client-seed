
function Client() {}

module.exports = function construct(config, log, _http, p, _, riddler) {
  var _log = log.module('Client', {config: config})
  var m = new Client()


  function errorHandler(response) {
    if (response instanceof Error) {
      // Something happened in setting up the request that triggered an Error
      console.log('Client Error', response.message);
    } else {
      // The request was made, but the server responded with a status code
      // that falls out of the range of 2xx
      console.log(response.data);
      console.log(response.status);
      console.log(response.headers);
      console.log(response.config);
    }
  }

  m.api = function(a,b) {
    return p.resolve(a+b)
  }

  return m
}
