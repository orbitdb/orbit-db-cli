'use strict'

const openDatabase = require('../lib/open-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')
const logo = require('../logo')
const utils = require('../../test/test-utils')
const cli = utils.runCommand

/* Export as Yargs command */
exports.command = 'demo <name>'
exports.desc = 'Runs a sequence of commands as an example'

exports.builder = function (yargs) {
  return yargs
    .usage(`${logo}\nUsage: $0 ${exports.command}`)
    .example("\n$0 demo Frank", "\nRuns the demo with name 'Frank'")
}

exports.handler = (argv) => {
  const dbname = '/orbitdb/demo'
  const startTime = new Date().getTime()
  const testData = JSON.stringify({
    _id: 1,
    name: argv.name,
  })

  const put = `${utils.bin} docstore put ${dbname} "${testData.replace(/\"/g, '\\"')}" --indexBy name`
  const search = `${utils.bin} docstore search ${dbname} "${argv.name}" --progress`
  const drop = `${utils.bin} docstore drop ${dbname} yes`

  process.stdout.write(logo + '\n')

  process.stdout.write(`> ${put}\n`)
  cli(put)
    .then((output) => process.stdout.write(output + '\n'))
    .then(() => process.stdout.write(`> ${search}\n`))
    .then(() => cli(search))
    .then((output) => process.stdout.write(output + '\n'))
    .then(() => process.stdout.write(`> ${drop}\n`))
    .then(() => cli(drop))
    .then((output) => process.stdout.write(output + '\n'))
    .catch((e) => exitOnError(e, false))
    .then(() => process.stdout.write(`Demo finished!\n`))
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
