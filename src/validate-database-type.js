'use strict'

const validateDatabaseType = (db, type) => {
  if (db.type !== type)
    throw new Error(`Database '${db.dbname}' (${db.type}) is not a ${type} database.`)
  return db  
}

module.exports = validateDatabaseType
