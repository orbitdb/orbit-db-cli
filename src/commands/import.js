'use strict'

const path = require('path')
const openDatabase = require('../lib/open-database')
const createDatabase = require('../lib/create-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')
const hookProgressOutput = require('../hook-output-progress')
const csvToObjects = require('../csv-to-objects')

const trimField = (e, name) => {
  if (typeof e === 'string')
    return e.substr(1, e.length - 2).trimLeft().trimRight()

  return e[name] = e[name] ? e[name].substr(1, e[name].length - 2).trimLeft().trimRight() : null
}

const importCsv = async (db, filename, options) => {
  process.stdout.write(`Importing to '${db.address.toString()}' `)

  const startTime = new Date().getTime()
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
    linesImported++
    db.events.emit('progress.load', db.address.toString(), null, null, linesImported, lines.length)
  }

  // process.stdout.write(`\nCSV read, writing to database...\n`, lines.length)
  let delta = new Date().getTime()
  for (let i = 0; i < lines.length; i ++) {
    const hash = await db.put(lines[i])
    const t = new Date().getTime()
    const deltaTime = new Date().getTime() - delta
    delta = t
    process.stdout.write(`\r${deltaTime}ms`)
    onProgress(hash)
  }
  const duration = new Date(deltaTime).toISOString().substr(11, 8)
  process.stdout.write(`\nImported ${linesImported} lines in ${duration}\n`)
  // return db.batchPut(lines, onProgress)
  //   .then(() => {
  //     const deltaTime = new Date().getTime() - startTime
  //     const duration = new Date(deltaTime).toISOString().substr(11, 8)
  //     process.stdout.write(`\nImported ${linesImported} lines in ${duration}\n`)
  //     return
  //   })
}

/* Export as Yargs command */
exports.command = 'import <file> <database> <schema>'
exports.aliases = ['csv']
exports.desc = 'Import a CSV file to a document database'

exports.builder = (yargs) => {
  return yargs
    .option('indexBy', {
      alias: 'idx',
      describe: 'Field to index by',
      default: '_id',
    })
    .option('progress', {
      alias: 'p',
      describe: 'Display pretty progress bars',
      default: false,
    })
}

exports.handler = (argv) => {
  const startTime = new Date().getTime()

  const options = {
    schema: require(path.resolve(argv.schema)),
    limit: argv.limit || -1,
    trimFields: ['name'],
  }

  return openDatabase(argv.database, argv, 'docstore')
    .then((db) => hookProgressOutput(db, argv, `Importing to`, startTime))
    .then((db) => importCsv(db, argv.file, options))
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
