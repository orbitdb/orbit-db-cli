'use strict'

const exec = require('child_process').exec

const bin = 'node ./src/bin'

const testDB = '/tests'
const testJson = '{\\\"_id\\\":\\\"1\\\",\\\"name\\\":\\\"Orbit User\\\"}'
const testOutput = JSON.stringify([{"_id": "1", "name": "Orbit User"}], null, 2) + '\n'

const putCommand    = `${bin} docstore put ${testDB} "${testJson}" _id`
const searchCommand = `${bin} docstore search ${testDB}`
const dropCommand   = `${bin} docstore drop ${testDB}`
const demoCommand   = `${bin} demo Frank`

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return reject(err)
      return resolve(stdout)
    })
  })
}

module.exports = {
  bin: bin,
  dbName: testDB,
  testDataJson: testJson,
  testDataOutput: testOutput,
  runCommand: runCommand,
  commands: {
    put: putCommand,
    search: searchCommand,
    drop: dropCommand,
    demo: demoCommand,
  },
  timeout: 5000,
}
