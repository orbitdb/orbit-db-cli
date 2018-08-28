'use strict'

const path = require('path')
const server = require('../lib/orbit-db-http-server/server.js')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')

/* Export as Yargs command */
exports.command = 'daemon'
exports.desc = 'Start a orbitdb daemon'

exports.builder = (yargs) => {
  return yargs
    .usage(`Usage: $0 daemon`)
    .example('\n$0 daemon',
             '\nOrbitDB server started at http://host:37373/')
}

exports.handler = (argv) => {
  const startTime = new Date().getTime()
  argv = Object.assign({}, argv, { create: false, localOnly: true })
  server().then(null)
}