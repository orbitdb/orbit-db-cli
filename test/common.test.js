'use strict'

const path = require('path')
const assert = require('assert')
const multihash = require('multihashes')
const rmrf = require('rimraf')
const OrbitDB = require('orbit-db')
const CLI = require('./cli')

describe('OrbitDB CLI - Common', function () {
  this.timeout(20000)

  let id, databaseAddress
  const dbname = '/testdb'
  const getId = () => CLI(`id`).toString().replace('\n', '')

  before(() => {
    // Make sure we don't have an existing database
    rmrf.sync('./orbitdb')
    id = getId()
    databaseAddress = OrbitDB.parseAddress(path.join('/', id, dbname))
  })

  it('returns multihash ID', () => {
    const id = getId()
    const mh = multihash.fromB58String(id)
    assert.equal(multihash.validate(mh), undefined)
  })

  it('errors if database doesn\'t exist', () => {
    let err
    try {
      CLI(`info ${dbname}`)
    } catch (e) {
      err = e.toString().split('\n')[1]
    }
    assert.equal(err, `Error: Database '${databaseAddress}' doesn't exist.`)
  })

  describe('create', function () {
    it('creates a database', () => {
      const type = 'counter'
      const result1 = CLI(`create ${dbname} ${type}`)
      const address = result1.toString().replace('\n', '')
      const result2 = CLI(`info ${address}`)
      const id = result2.toString().split('\n').find(e => e.indexOf('Owner:') > -1).split(': ')[1]
      const expected = path.join('/', id, dbname)
      assert.equal(result1.toString().includes(expected), true)
    })

    it('needs a valid type to create a database', () => {
      let err, id
      CLI(`drop ${databaseAddress} yes`)
      try {
        id = getId()
        CLI(`create ${databaseAddress} abc`)
      } catch (e) {
        err = e.toString().split('\n')[1]
      }
      assert.equal(err, `Error: Invalid database type 'abc'.`)
    })

    it('errors if database already exists', () => {
      let err, id
      try {
        id = getId()
        CLI(`create ${dbname} feed`)
        CLI(`create ${dbname} feed`)
      } catch (e) {
        err = e.toString().split('\n')[1]
      }
      assert.equal(err, `Error: Database '${databaseAddress}' already exists!`)
    })
  })


  describe('info', function () {
    it('local database can be referred to with or without the owner ID', () => {
      // Locally '/QmSv8zWGgtkbqvfviTWT53smb7KKKJwKtoz6aqX4mkrgTx/testdb'
      // is the same as '/testdb'
      CLI(`drop ${databaseAddress} yes`)
      const type = 'counter'
      const result1 = CLI(`create ${dbname} ${type}`)
      const address = result1.toString().replace('\n', '')
      const result2 = CLI(`info ${address}`)
      const result3 = CLI(`info ${dbname}`)
      assert.equal(result2.toString(), result3.toString())
    })

    it('shows database info', () => {
      const result = CLI(`info ${databaseAddress}`)
      assert.equal(result.toString().split('\n')[0], databaseAddress)
      assert.equal(result.toString().includes('Owner:'), true)
      assert.equal(result.toString().includes(`Type: counter`), true)
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
      const result1 = CLI(`drop ${databaseAddress} yes`)
      assert.equal(result1.toString().includes(`Dropped database '${databaseAddress}'`), true)

      let err
      try {
        CLI(`info ${databaseAddress}`)
      } catch (e) {
        err = e.toString()
      }
      assert.equal(err.includes(`Database '${databaseAddress}' doesn't exist.`), true)
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
      assert.equal(version.toString().replace('\n', ''),'0.0.8')
    })

    it('alias also shows version of orbit db', () => {
      const version = CLI(`v`)
      assert.equal(version.toString().replace('\n', ''),'0.0.8')
    })
  })

})
