

require('dotenv').load()

global.config = require('./config')({stage: process.env.stage, robustKey: process.env.robustKey, app: 'APP_NAME', env:'test', component:'clientbase' })
global.log = require('win-with-logs')(config.logging)
require('../setup')
global.m = require('../../index')(config, log)
