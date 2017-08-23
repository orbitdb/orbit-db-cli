'use strict'

const readline = require('readline')
const pWhilst = require('p-whilst')
const table = require('../../views/table')
const schemaView = require('../../views/csv-schema1-view')

const doQuery = (db, text, limit, outputJson) => {
  if (!outputJson)
    process.stdout.write(`Searching for '${text}' from '${db.dbname}'`)

  const startTime = new Date().getTime()

  const result = text !== undefined
    ? db.get(text)
    : db.query(e => true) // query all

  if (result.length === 0 && Object.keys(db._index._index).length === 0) {
    process.stdout.write(`\nDatabase '${db.dbname}' is empty!\n`)
    return Promise.resolve([])
  }

  const duration = new Date().getTime() - startTime

  if (result.length > 0 && !outputJson) {
    const resultView = table(schemaView(), limit && limit > -1 ? result.slice(-limit) : result, { maxWidth: process.stdout.columns })
    process.stdout.write('\n' + resultView)
  }

  if (!outputJson)
    process.stdout.write(`\nFound ${limit && limit > -1 ? Math.min(limit, result.length) : Math.max(limit, result.length)} matches (${duration} ms)\n`)
  else
    process.stdout.write(JSON.stringify(result, null, 2) + '\n')

  return Promise.resolve(result)
}

const search = (db, text, options) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  let done = false
  const isExitCommand = (text) => text === '/quit' || text === '/q'
  const waitForInput = (prompt) => new Promise((resolve) => rl.question(prompt, resolve))

  const queryLoop = () => {
    return waitForInput('\nSearch: ')
      .then((text) => {
        done = isExitCommand(text)
        if (!done)
          return doQuery(db, text, options.limit)
        return
      })
  }

  if (options.interactive) {
    process.stdout.write('Type /quit to exit the search prompt\n')
    return pWhilst(() => done === false, queryLoop)
  } else {
    // if (options.json !== true)
    //   process.stdout.write('\n')

    return doQuery(db, text || '', options.limit, options.json)
  }
}

module.exports = search
