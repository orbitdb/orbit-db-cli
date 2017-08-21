const path = require('path')
const { execSync } = require('child_process')

const CLI = (cmd) => {
  return execSync(`node "${path.resolve('./src/bin')}" ${cmd}`)
}

module.exports = CLI
