'use strict'

const startIpfs = require('../start-ipfs.js')
const config = require('../config')
const initDB = require('../init-db.js')
const hookProgressOutput = require('../hook-output-progress')

const openDatabase = (argv, options) => {
  options = options || Object.assign({}, { loadProgress: argv.progress || false })
  return startIpfs(config.daemonConfig)
    .then((ipfs) => {
      const db = initDB(ipfs, config.databasePath, argv._[0], argv)

      if (options.loadProgress && argv.output !== 'json') {
        hookProgressOutput(db, argv, `Loading database`, new Date().getTime())      
        process.stdout.write(`Loading database '${db.dbname}'`)
      }

      return db.loadFromSnapshot()
      // return db.load()
        .then(() => {
          if (options.loadProgress && argv.output !== 'json')
            process.stdout.write('\n')
        })
        .then(() => db)
    })
}

module.exports = openDatabase
