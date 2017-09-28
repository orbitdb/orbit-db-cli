'use strict'

const validateDatabaseType = (db, type) => {
  if ((Array.isArray(type) && !type.includes(db.type))
      || (!Array.isArray(type) && db.type !== type))
    throw new Error(`Database '${db.address.toString()}' (${db.type}) is not a ${type} database.`)
  return db
}

module.exports = validateDatabaseType
