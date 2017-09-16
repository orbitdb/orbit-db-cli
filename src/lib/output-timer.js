'use strict'

const Logger = require('logplease')
const logger = Logger.create('timer', { color: Logger.Colors.Yellow })

const outputTimer = (startTime, argv) => {
  const deltaTime = new Date().getTime() - startTime

  if ((argv.timing || argv.t) && argv.output !== 'json') {
    process.stdout.write(`Runtime: ${deltaTime} ms\n`)
  }

  logger.debug(`Runtime: ${deltaTime} ms`)
}

module.exports = outputTimer
