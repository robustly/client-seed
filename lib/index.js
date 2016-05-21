
function EmmitClient() {}

module.exports = function construct(config, log, _http, p, _, riddler) {
  var _log = log.module('emmit-client')
  var __allProjects = {name: 'All Projects'}
  var _state = {
    currentProject: __allProjects,
    projectList: null
  }, unit = {
    'electricity': 'kWh',
    'water': 'm³',
    'gas': 'm³',
    'voltage': 'V'
  }

  var m = new EmmitClient()

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

  m.setProjectId = function(projectId) {
    if (_state.projectList) {
      _state.currentProject = _.find(_state.projectList, {id: parseInt(projectId)}) || __allProjects
      log('$emmit:projectChanged', _state.currentProject)
    }
  }

  m.getReport = function(reportName, filter, opts) {
    log = _log.method('getReport', {reportName: reportName, filter: filter, opts: opts})
    var params = _.merge({reportName: reportName}, filter, opts)

    return _http.get('report?'+riddler.stringify(params))
      .then(function(response) {
        if (response.status='Ok') {
          log.debug('response', response)
          if (response && response.data) return response.data.result
        }
        else throw response
      })
      .catch(errorHandler)
  }

  m.getDataSources = function(projectId) {
    var goal = log.method('getDataSources', {projectId: projectId})
    return _http.get('/api/data-sources')
      .then(function(response) {
        return response.data;
      })
      .then(goal.result)
      .catch(goal.fail)
  }

  m.createUser = function(newUser) {
    return _http.post('/api/user', newUser)
      .then(function(r) {
        return r.data;
      })
      .catch(function(r) {
        log.error('Error saving user.', r);
        throw r.data;
      })
  }

  m.updateUser = function(user) {
    return _http.put('/api/user', {
      id: user.id,
      name: user.name,
      defaultProject: user.defaultProject,
      role: user.role,
      email: user.email
    })
      .then(function(r) {
        return r.data;
      })
      .catch(function(r) {
        log.error('Error updating user.', r);
        throw r.data;
      })
    }

    m.getUserList = function(user) {
      function computeStatus(user) {
        if (user.locked) return 'Locked';
        if (!user.lastLogin) return 'New';
        if ((user.lastPasswordReset || 0) > (user.lastLogin || 0)) return 'Password Reset';
        if (user.lastLogin) return 'Active';
      }

      return _http.get('/api/users')
        .then(function(response) {
          var userList = response.data.result;
          userList = _.map(userList, function(user) {
            user.creationDate = moment.unix(user.creationDate).format("M/D/YYYY H:mm");
            user.status = computeStatus(user);
            user.lastLogin = user.lastLogin == null ? '' : moment.unix(user.lastLogin).format("M/D/YYYY H:mm");
            return user;
          });
          return userList;
        })
        .catch(function(err) {
          console.error(err);
        })
    }

    m.lockAccount = function(userId) {
      log('lockAccount', userId);
      return _http.post('/api/userlock', {userId: userId})
        .then(function(r) {
          return r.data;
        })
        .catch(function(r) {
          log.error('Error locking user.', r);
          throw r.data;
        });
    }

    m.unlockAccount = function(userId) {
      log('unlockAccount', userId);
      return _http.delete('/api/userlock/'+userId)
        .then(function(r) {
          return r.data;
        })
        .catch(function(r) {
          log.error('Error unlocking user.', r);
          throw r.data;
        });
    }

    m.deleteUser = function(user) {
      if (!user) throw "api.deleteUser requires user parameter.";
      log.log('deleteUser()', user);
      return _http.delete('/api/user/'+user.id)
        .then(function(r) {
          return r.data;
        })
        .catch(function(r) {
          log.error('Error deleting user.', r);
          throw r.data;
        });
    }

    m.resetPassword = function(email) {
      return _http.post('/api/passwordreset', {email: email})
        .then(function(r) {
          return r.data;
        })
        .catch(function(r) {
          log.error('Error resetting user password.', r);
          throw r.data;
        });
    }

    m.listProjects = function(user) {
      var userId;
      if (user) {
        userId = user.id;
      }

      return _http.get('/api/projects' + (userId ? '/'+userId : ''))
        .then(function(r) {
          return r.data.result;
        })
        .catch(function(r) {
          log.error('Error resetting user password.', r);
          throw r.data;
        });
    }

    m.assignProjects = function(user, projects) {
      var body = _.map(projects, function(p) {
        return {user: user.id, project: p.id }
      });

      return _http.post('/api/project-assignment', body)
        .then(function(r) {
          return r.data;
        })
        .catch(function(r) {
          log.error('Error saving project assignments', r);
          throw r.data;
        });
    }

    m.getMeterDataIndex = function(meterUUID, startDate, count) {
      var request={
        params: {uuid: meterUUID}
      };
      if(count) request.params.limit=count
      if(startDate) request.params.timestamp=startDate

      console.log('calling with parameters',request)
      return _http.get('/api/meter-data', request)
        .then(function(r) {
          console.log('api/meter-data:', r);
          return _.map(r.data.result, function(r) {
            return {
              arrived: moment(r.indexedOn).fromNow(),
              usageStart: moment.unix(r.usageStart).format("M/D/YYYY H:mm"),
              usageEnd: moment.unix(r.usageEnd).format("M/D/YYYY H:mm"),
              duration: r.duration,
              dataUrl: r.dataUrl,
              dataUrl2: r.dataUrl
            };
          });
        });
    }

    m.getRawData = function(dataUrl) {
      return _http.get(dataUrl)
        .then(function(r) {
          console.log('getRawData Response:', r);
          return JSON.stringify(r.data);
        });
    }

    m.getCommunicationLogs = function(meter) {
      if (!meter) return p.reject('No meter specified.')

      return _http.get('/api/meter-log', {
          params: {uuid: meter ? meter.uuid || '' : ''}
        })
        .then(function(r) {
          console.log('api/meter-log:', r);
          var projection = _.map(r.data.result, function(row) {
            return {
              timestamp: moment.unix(Math.floor(row.timestamp/1000)).fromNow(),
              status: row.status,
              request: JSON.stringify(row.details.request),
              responseBody: row.details.response.body,
              responseCode: row.details.response.status
            };
          });
          return projection;
        });
    }

    m.getMeterList = function(project) {
      return _http.get('/api/meter-status', {
        params: {project: project}
      })
      .then(function(r) {
        var result = r.data.result;
        console.log('result', result);
        result = _.map(result, function(meter) {
          if (meter.lastReadingTime) {
            meter.lastReadingTimeEpoch = meter.lastReadingTime
            if (meter.lastReadingTime > Math.floor(new Date().getTime()/1000)) {
              meter.lastReadingTime = '< 1 minute'
            } else {
              meter.lastReadingTime = moment.unix(meter.lastReadingTime).fromNow();
            }
          } else {
            meter.lastReadingTime = "Not Connected";
          }

          if (meter.info) {
            var infoStr = "";
            if (meter.info.lastRawTimestamp) {
              if (meter.tz_offset) meter.info.lastRawTimestamp -= (meter.tz_offset * 3600);
              if (meter.info.lastRawTimestamp > Math.floor(new Date().getTime()/1000)) {
                infoStr = "Latest Raw DB Data: < 1 minute."
              } else {
                infoStr = "Latest Raw DB Data: "+ moment.unix(meter.info.lastRawTimestamp).fromNow();
              }
            }
            if (meter.info.message) {
              infoStr += "...  " + meter.info.message;
            }
            if (meter.status != 'Ok') meter.info = infoStr
            else meter.info = ''
          }

          if (meter.lastReadingValue) {
            meter.lastReadingValue = meter.lastReadingValue * meter.conversion
            meter.lastReadingValueStr = meter.lastReadingValue.toFixed(3) + ' ' + unit[meter.type]
          } else {
            meter.lastReadingValueStr = "0 " + unit[meter.type]
          }

          meter.lastReadingStr = meter.lastReadingTime.toString() + ': ' + meter.lastReadingValueStr

          return meter;
        });
        return result;
      })
      .catch(function(r) {
        log.error('Error getting meter statuses..', r);
        throw r.data;
      });
    }

  return m
}
