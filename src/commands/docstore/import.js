'use strict'

const path = require('path')
const openDatabase = require('../../lib/open-database')
const outputTimer = require('../../lib/output-timer')
const exitOnError = require('../../exit-on-error')
const hookProgressOutput = require('../../hook-output-progress')
const csvToObjects = require('../../csv-to-objects')

const trimField = (e, name) => {
  if (typeof e === 'string')
    return e.substr(1, e.length - 2).trimLeft().trimRight()

  return e[name] = e[name] ? e[name].substr(1, e[name].length - 2).trimLeft().trimRight() : null
}

const importCsv = (db, filename, options) => {
  process.stdout.write(`Import '${filename}' to '${db.dbname}' `)

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
    linesImported ++
    db.events.emit('progress.load', db.dbname, null, null, linesImported, lines.length)
  }

  return db.batchPut(lines, onProgress)
    .then(() => {
      const deltaTime = new Date().getTime() - startTime
      const duration = new Date(deltaTime).toISOString().substr(11, 8)
      process.stdout.write(`\nImported ${linesImported} lines in ${duration}\n`)
      return
    })
}

/* Export as Yargs command */
exports.command = 'import <inputFile> <dbname> <schema>'
exports.desc = 'Import a csv file to a database'

exports.builder = function (yargs) {
  return yargs
    // .example('\n$0 put /posts "{\\"id\\":\\"1\\",\\"author\\":\\"haad\\",\\"content\\":\\"Hello friend\\"}" content', 
    //          '\nAdd a document to the database, index by the field \'content\'')
    .option('indexBy', {
      alias: 'idx',
      describe: 'Field to index by',
      default: '_id',
    })
}

exports.handler = (argv) => {
  const startTime = new Date().getTime()

  const options = { 
    schema: require(path.resolve(argv.schema)), 
    limit: argv.limit || -1,
    trimFields: ['name'],
  }

  openDatabase(argv, { loadProgress: false })
    .then((db) => hookProgressOutput(db, argv, `Import '${argv.inputFile}' to`, startTime))
    .then((db) => importCsv(db, argv.inputFile, options))
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
