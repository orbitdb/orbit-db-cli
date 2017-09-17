'use strict'

const outputTimer = require('../lib/output-timer')
const logo = require('../logo')
const cli = require('../../src/cli')

/* Export as Yargs command */
exports.command = 'demo <name>'
exports.aliases = ['tour']
exports.desc = 'Runs a sequence of commands as an example'

exports.builder = (yargs) => {
  return yargs
    .usage(`${logo}\nUsage: $0 ${exports.command}`)
    .example('n$0 demo Frank', '\nRuns the demo with name \'Frank\'')
}

exports.handler = (argv) => {
  const bin = argv['$0']
  const dbname = '/orbitdb/demo'
  const startTime = new Date().getTime()
  const testData = JSON.stringify({
    _id: 1,
    name: argv.name,
  })

  let address  

  process.stdout.write(logo + '\n')

  const create = `create ${dbname} docstore`
  process.stdout.write(`> node "${bin}" ${create}\n`)
  const output0 = cli(create)
  process.stdout.write(output0.toString() + '\n')

  address = output0.toString().replace('\n', '')

  const put = `put ${address} "${testData.replace(/\"/g, '\\"')}" --indexBy name`
  process.stdout.write(`> node "${bin}" ${put}\n`)
  const output1 = cli(put)
  process.stdout.write(output1.toString() + '\n')

  const search = `get ${address} "${argv.name}" --progress`
  process.stdout.write(`> node "${bin}" ${search}\n`)
  const output2 = cli(search)
  process.stdout.write(output2.toString() + '\n')

  const drop = `drop ${address} yes`
  process.stdout.write(`> node "${bin}" ${drop}\n`)
  const output3 = cli(drop)
  process.stdout.write(output3.toString() + '\n')

  // exitOnError(e, false))
  process.stdout.write(`Demo finished!\n`)
  outputTimer(startTime, argv)
  process.exit(0)
}
