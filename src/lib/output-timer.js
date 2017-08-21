'use strict'

const outputTimer = (startTime, argv) => {
  if (argv.timing) {
    const deltaTime = new Date().getTime() - startTime
    if (argv.output !== 'json')
      process.stdout.write(`Runtime: ${deltaTime}ms\n`)
  }  
}

module.exports = outputTimer
