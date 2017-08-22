const Logger = require('logplease')
Logger.setLogLevel('NONE') // turn off logs

const logger = Logger.create("orbitdb-cli", { color: Logger.Colors.Cyan })

module.exports = (e, displayErrorMessage = true) => {
  if (displayErrorMessage) {
    console.error("Error:", e.message)
    logger.error(e.stack)
  } else {
    console.error(e.message)
  }
  process.exit(1)
}
