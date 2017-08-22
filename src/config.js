'use strict'

const path = require('path')

const dataPath = path.join(process.cwd(), '.orbitdb')
const dbPath = path.join(dataPath, '/db/')
const ipfsPath = path.join(dataPath, '/ipfs/')

const conf = {
  start: false,
  repo: process.env.IPFS_PATH || path.join('./.orbitdb', '/ipfs'),
  EXPERIMENTAL: {
    pubsub: true,        
  }
}

module.exports = {
  ipfsConfig: conf,
  databasePath: dbPath,
}
