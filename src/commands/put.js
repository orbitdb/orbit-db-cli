'use strict'

const runCommand = require('../lib/run-command')

const put = async (db, doc, options) => {
  const startTime = new Date().getTime()
  const hash = await db.put(doc)
  const duration = new Date().getTime() - startTime
  process.stdout.write(`Added document '${doc[options.indexBy || '_id']}'\n`)
}

/* Export as Yargs command */
exports.command = 'put <database> <document>'
exports.desc = 'Add a document to a document database'

exports.builder = function (yargs) {
  return yargs
    .example('\n$0 put /posts "{\\"id\\":\\"1\\",\\"author\\":\\"haad\\",\\"content\\":\\"Hello friend\\"}" --indexBy content',
             '\nAdd a document to the database, index by the field \'content\'')
}

exports.handler = async (argv) => {
  // Run the command on database 'argv.database', supported database type is docstore
  await runCommand(argv.database, ['docstore'], argv, async (db) => {
    return await put(db, JSON.parse(argv.document), { indexBy: argv.indexBy })
  })
}
