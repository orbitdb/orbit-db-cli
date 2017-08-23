'use strict'

const outputTimer = require('../lib/output-timer')
const logo = require('../logo')
const cli = require('../../test/cli')

/* Export as Yargs command */
exports.command = 'demo <name>'
exports.aliases = ['tour']
exports.desc = 'Runs a sequence of commands as an example'

exports.builder = function (yargs) {
  return yargs
    .usage(`${logo}\nUsage: $0 ${exports.command}`)
    .example('n$0 demo Frank', '\nRuns the demo with name \'Frank\'')
}

exports.handler = (argv) => {
  const dbname = '/orbitdb/demo'
  const startTime = new Date().getTime()
  const testData = JSON.stringify({
    _id: 1,
    name: argv.name,
  })

  // console.log(">>", argv)
  const bin = argv['$0']
  const put = `put ${dbname} "${testData.replace(/\"/g, '\\"')}" --indexBy name`
  const search = `get ${dbname} "${argv.name}" --progress`
  const drop = `drop ${dbname} yes`

  process.stdout.write(logo + '\n')

  process.stdout.write(`> node "${bin}" ${put}\n`)
  const output1 = cli(put)
  process.stdout.write(output1.toString() + '\n')

  process.stdout.write(`> node "${bin}" ${search}\n`)
  const output2 = cli(search)
  process.stdout.write(output2.toString() + '\n')

  process.stdout.write(`> node "${bin}" ${drop}\n`)
  const output3 = cli(drop)
  process.stdout.write(output3.toString() + '\n')

  // exitOnError(e, false))
  process.stdout.write(`Demo finished!\n`)
  outputTimer(startTime, argv)
  process.exit(0)
}
