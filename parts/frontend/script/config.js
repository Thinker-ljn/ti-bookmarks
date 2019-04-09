'use strict'

// const path = require('path')

module.exports = {
  build: {
  },
  dev: {
    proxyTable: {
      '/api': {
        target: process.env.BACKEND || 'http://localhost:8002',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
  base: {
    cssScopedName: '[local]__[hash:base64:6]'
  }
}
