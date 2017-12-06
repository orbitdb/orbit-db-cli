'use strict'

const path = require('path')
const assert = require('assert')
const multihash = require('multihashes')
const rmrf = require('rimraf')
const OrbitDB = require('orbit-db')
const CLI = require('./cli')
const packageConfig = require('./../package.json');

describe('OrbitDB CLI - Common', function () {
  this.timeout(20000)

  let id, databaseAddress
  const dbname = '/testdb'
  const getId = () => CLI(`id`).toString().replace('\n', '')

  before(() => {
    // Make sure we don't have an existing database
    rmrf.sync('./orbitdb')
    id = getId()
    databaseAddress = (CLI(`create ${dbname} eventlog`)).toString().replace('\n', '')
    CLI(`drop ${databaseAddress} yes`)
  })

  it('returns multihash ID', () => {
    const id = getId()
    const mh = multihash.fromB58String(id)
    assert.equal(multihash.validate(mh), undefined)
  })

  it('errors if database doesn\'t exist', () => {
    let err
    try {
      CLI(`drop ${databaseAddress} yes`)
      CLI(`info ${databaseAddress}`)
    } catch (e) {
      err = e.toString().split('\n')[1]
    }
    assert.equal(err, `Error: Database '${databaseAddress}' doesn't exist!`)
  })

  describe('create', function () {
    let address

    it('creates a database', () => {
      const type = 'counter'
      const result1 = CLI(`create ${dbname} ${type}`)
      address = result1.toString().replace('\n', '')
      const result2 = CLI(`info ${address}`)
      CLI(`drop ${address} yes`)
      const id = result2.toString().split('\n').find(e => e.indexOf('Owner:') > -1).split(': ')[1]
      assert.equal(result1.toString().includes('/orbitdb'), true)
      assert.equal(result1.toString().includes(dbname), true)
    })

    it('needs a valid type to create a database', () => {
      let err
      try {
        CLI(`create ${dbname} abc`)
      } catch (e) {
        err = e.toString().split('\n')[1]
      }
      assert.equal(err, `Error: Invalid database type 'abc'`)
    })

    it('errors if database already exists', () => {
      let err, address
      try {
        address = (CLI(`create ${dbname} feed`)).toString().replace('\n', '')
        CLI(`create ${dbname} feed`)
      } catch (e) {
        err = e.toString().split('\n')[1]
      }
      assert.equal(err, `Error: Database '${address}' already exists!`)
      CLI(`drop ${address} yes`)
    })
  })


  describe('info', function () {
    // it('local database can be referred to with or without the owner ID', () => {
    //   // Locally '/QmSv8zWGgtkbqvfviTWT53smb7KKKJwKtoz6aqX4mkrgTx/testdb'
    //   // is the same as '/testdb'
    //   CLI(`drop ${databaseAddress} yes`)
    //   const type = 'counter'
    //   const result1 = CLI(`create ${dbname} ${type}`)
    //   const address = result1.toString().replace('\n', '')
    //   const result2 = CLI(`info ${address}`)
    //   const result3 = CLI(`info ${dbname}`)
    //   assert.equal(result2.toString(), result3.toString())
    // })

    it('shows database info', () => {
      const result1 = CLI(`create ${dbname} eventlog`)
      const address = result1.toString().replace('\n', '')
      const result = CLI(`info ${databaseAddress}`)
      console.log(result.toString())
      assert.equal(result.toString().split('\n')[0], databaseAddress)
      assert.equal(result.toString().includes('Owner:'), true)
      assert.equal(result.toString().includes(`Type: eventlog`), true)
      CLI(`drop ${address} yes`)
    })
  })

  describe('drop', function () {
    it('needs a confirmation to drop a database', () => {
      let err
      try {
        CLI(`drop ${databaseAddress} no`)
      } catch (e) {
        err = e.toString()
      }
      assert.equal(err.includes(`Can't drop the database. Confirm with: 'yes'`), true)
    })

    it('drops a database', () => {
      const result1 = CLI(`create ${dbname} eventlog`)
      const address = result1.toString().replace('\n', '')

      const result2 = CLI(`drop ${address} yes`)
      assert.equal(result2.toString().includes(`Dropped database '${address}'`), true)

      let err
      try {
        CLI(`info ${address}`)
      } catch (e) {
        err = e.toString()
      }
      assert.equal(err.includes(`Database '${address}' doesn't exist!`), true)
    })
  })


  describe('add', function () {
    it('throws an error if no input data is given', () => {
      let err
      try {
        CLI(`add ${databaseAddress}`)
      } catch (e) {
        err = e.toString().split('\n')[1].replace('\n', '')
      }
      assert.equal(err, 'Error: No input data!')
    })
  })

  describe('version', () => {
    it('shows current version of orbit db', () => {
      const version = CLI(`version`)
      assert.equal(version.toString().replace('\n', ''),packageConfig.version)
    })

    it('alias also shows version of orbit db', () => {
      const version = CLI(`v`)
      assert.equal(version.toString().replace('\n', ''),packageConfig.version)
    })
  })

})
