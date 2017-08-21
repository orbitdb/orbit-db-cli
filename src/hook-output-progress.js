'use strict'

const outputProgress = require('./lib/output-progress')

const longLoadingLimit = 10000

const hookProgressOutput = (db, argv, loadingText, startTime) => {
  const normalizeTotal = (total) => argv.limit && argv.limit > -1 ? Math.min(argv.limit, total) : total

  const onProgress = (dbname, hash, entry, count, total) => {
    if (argv.progress === true && argv.output !== 'json') {
      if (normalizeTotal(total) > longLoadingLimit && ((count % 100) === 0 || count === normalizeTotal(total))) {
        outputProgress(loadingText, db.dbname, count, normalizeTotal(total), startTime)
      } else if(normalizeTotal(total) <= longLoadingLimit) {
        outputProgress(loadingText, db.dbname, count, normalizeTotal(total), startTime)
      }
    }
  }

  db.events.on('progress.load', onProgress)
  // db.events.on('progress.init', onProgress)
  db.events.on('load', () => {
    if (argv.progress === true && argv.output !== 'json') {
      outputProgress(loadingText, db.dbname, 0, 1, startTime)
    }
  })

  return db
}

module.exports = hookProgressOutput
