'use strict'

const path = require('path')

const defaultOrbitDbDir = './orbitdb'

const conf = {
  repo: process.env.IPFS_PATH || path.join(defaultOrbitDbDir, '/ipfs'),
  start: false,
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: {
      API: '/ip4/127.0.0.1/tcp/0',
      Gateway: '/ip4/0.0.0.0/tcp/0',
      Swarm: [
        '/ip4/0.0.0.0/tcp/0',
        // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
      ],
    },
  },
  Discovery: {
    MDNS: {
      Enabled: true,
      Interval: 1,
    },
  },
}

module.exports = {
  defaultDatabaseDir: defaultOrbitDbDir,
  ipfsConfig: conf,
}
