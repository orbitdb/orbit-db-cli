'use strict'

const packageConfig = require('../../package.json');

/* Export as Yargs command */
exports.command = 'version'
exports.aliases = ['v']
exports.desc = 'Show information about current orbit-db'

exports.builder = function(yargs) {
    return yargs
        .usage(`Usage: $0 version`)
}

exports.handler = async(argv) => {
    const version = packageConfig.version;
    process.stdout.write(`${version}\n`)
    process.exit(0)
}