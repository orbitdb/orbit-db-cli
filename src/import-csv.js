'use strict'

const outputProgress = require('./lib/output-progress')
const csvToObjects = require('./csv-to-objects')

const trimField = (e, name) => {
  if (typeof e === 'string')
    return e.substr(1, e.length - 2).trimLeft().trimRight()

  return e[name] = e[name] ? e[name].substr(1, e[name].length - 2).trimLeft().trimRight() : null
}

const importCsv = (db, filename, options) => {
  const limit = options ? options.limit : -1
  const schema = options.schema || ['undefined']
  let linesImported = 0

  let lines = csvToObjects(filename, limit, schema)

  if (options && options.trimFields && options.trimFields.length > 0) {
    options.trimFields.forEach((field) => {
      lines.forEach(e => trimField(e, field))
    })
  }

  const onProgress = (entry) => {
    linesImported ++
    db.events.emit('progress.load', db.dbname, null, null, linesImported, lines.length)
  }

  return db.batchPut(lines, onProgress)
    .then(() => linesImported)
}

module.exports = importCsv
