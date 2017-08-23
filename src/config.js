'use strict'

const path = require('path')

const defaultOrbitDbDir = './orbitdb'

const conf = {
  start: false,
  repo: process.env.IPFS_PATH || path.join(defaultOrbitDbDir, '/ipfs'),
  EXPERIMENTAL: {
    pubsub: true,
  }
}

module.exports = {
  defaultDatabaseDir: defaultOrbitDbDir,
  ipfsConfig: conf,
}
