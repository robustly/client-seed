describe('example unit test', function() {
  var m
  beforeEach(function() {
    m = ioc.get('client')
  })
  describe('api(a,b)', function() {
    it('resolves the sum of a and b', function() {
      return m.api(1,3)
        .then(function(result) {
          expect(result).equals(4)
        })
    })
  })
})
