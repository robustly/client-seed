describe('emmit', function() {
  describe('getReport()', function() {
    describe('@projectSummary', function() {
      it('resolves a project summary', function() {
        return m.getReport('projectSummary', {projectId: 1, locus: '2015-10-05'})
          .then(function(report) {
            expect(report.cost.dailySavings).to.exist
            expect(report.cost.monthlySavings).to.exist
            expect(report.cost.monthlySavings.length).equals(2)
          })
      })
    })
  })
})
