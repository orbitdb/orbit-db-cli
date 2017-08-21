#! /usr/bin/env node
'use strict'

const argv = require('yargs')
const logo = require('./logo')

argv
  .usage(logo + '\nUsage: $0 <command>')
  .commandDir('commands')
  .demand(1)
  .help('help')
  .alias('h', 'help')
  .argv
