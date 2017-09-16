const path = require('path')
const { execSync } = require('child_process')

const CLI = (cmd, options = {}) => {
  const opts = Object.assign({}, process.env, options.env)
  return execSync(`node "${path.resolve(__dirname, '../src/bin')}" ${cmd}`, opts)
}

module.exports = CLI
