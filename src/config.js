'use strict'

const path = require('path')

const conf = {
  start: false,
  repo: process.env.IPFS_PATH || path.join('./.orbitdb', '/ipfs'),
  EXPERIMENTAL: {
    pubsub: true,
  }
}

module.exports = {
  ipfsConfig: conf,
}
