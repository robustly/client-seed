## API Reference

### getReport(reportName, filter, opts)

#### Report Types
  reportName
    - projectSummary
      - description: returns total project savings broken down daily for the last 7 days.  As well as monthly savings for the current month and previous month (relative to *locus*)
      - filters: projectId (int), locus (string)
      - report example:
      ```
      {
      "cost": {
          "dailySavings": [
              {
                  "timestamp": "1443412800",
                  "totalsavings": 244.22124344289466
              },
              {
                  "timestamp": "1443499200",
                  "totalsavings": 265.43192069976
              },
              {
                  "timestamp": "1443585600",
                  "totalsavings": 355.0545539610746
              },
              {
                  "timestamp": "1443672000",
                  "totalsavings": 368.9702763999442
              },
              {
                  "timestamp": "1443758400",
                  "totalsavings": 312.78461821454016
              },
              {
                  "timestamp": "1443844800",
                  "totalsavings": 248.9930759137938
              },
              {
                  "timestamp": "1443931200",
                  "totalsavings": 215.49696377621564
              }
          ],
          "monthlySavings": [
              {
                  "timestamp": "1441080000",
                  "totalsavings": 21285.258958669026
              },
              {
                  "timestamp": "1443672000",
                  "totalsavings": 7597.0158991216
              }
          ]
      },
      "usage": {}
  }
      ```

#### Parameters:
  projectId (int)
    The project identifier (number)
    Example: 1

  locus (string)
    A relative position for data points in a report.
    Example: '2015-10-20'
