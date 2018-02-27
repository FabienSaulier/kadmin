'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"https://feeleat.herokuapp.com/"',
  BASE_URL: '"https://feeleatadmin.herokuapp.com/"',
  DISABLED_LOGIN: false,
})
