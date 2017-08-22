#! /usr/bin/env node
'use strict'

const argv = require('yargs')
const logo = require('./logo')

argv
  .usage(logo + '\nUsage: $0 <command> <database>')
  .commandDir('commands2')
  .demand(1)
  .help('help')
  .alias('h', 'help')
  .argv
