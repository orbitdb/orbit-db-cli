'use strict'

const waitForPeers = (db) => {
  process.stdout.write(`Searching for peers for '${db.address.toString()}'`)
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      const peers = await db._ipfs.pubsub.peers(db.address.toString())
      if (peers.length > 0) {
        clearInterval(interval)
        process.stdout.write(`\nConnected to peers:\n`)
        process.stdout.write(peers.map((e, i) => `${i + 1}. ${e}`).join('\n') + '\n')
        resolve(db)
      }
    }, 200)
  })
}

module.exports = waitForPeers
