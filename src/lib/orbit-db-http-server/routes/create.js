const create = async (req, res) => {
  try {
    // Get the name and type from the request
    const { name, type } = req.params

    // Create the database
    const db = await req.orbitdb.create(name, type, { write: ['*'] })

    // Return databse info as the result
    res.send({
      name: db.dbname,
      type: db.type,
      address: db.address.toString(),
    })
  } catch (e) {
    res.status(500).send({ error: e.toString() })
  }
}

module.exports = create
