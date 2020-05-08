var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PUBLIC_PATH: (process.env.PUBLIC_PATH) ?
    `"${process.env.PUBLIC_PATH}"` : '"/"',
})
