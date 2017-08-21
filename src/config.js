'use strict'

const path = require('path')

const dataPath = path.join(process.cwd(), '.orbitdb')
const dbPath = path.join(dataPath, '/db/')
const ipfsPath = path.join(dataPath, '/ipfs/')

const conf = { 
  IpfsDataDir: ipfsPath,
  Addresses: {
    // API: '/ip4/127.0.0.1/tcp/0',
    // Swarm: ['/ip4/0.0.0.0/tcp/0'],
    // Gateway: '/ip4/0.0.0.0/tcp/0',
    API: null,
    Swarm: [],
    Gateway: null,
  },
}

module.exports = {
  daemonConfig: conf,
  databasePath: dbPath,
}
