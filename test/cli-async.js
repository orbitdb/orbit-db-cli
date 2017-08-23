const path = require('path')
const { spawn } = require('child_process')

const CLI = (cmd, options = {}) => {
  const opts = Object.assign({}, process.env, options.env)
  return spawn('node', [path.resolve(__dirname, '../src/bin')].concat(cmd.split(' ')), opts)
}

module.exports = CLI
