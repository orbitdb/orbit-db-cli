const get = async (req, res) => {
  try {
    // Get the database address from the request
    const address = req.params[0]

    // Get params on how we should output the results
    const shouldStream = req.query.live || false

    // Set the limit on how many entries we should return in the result
    const limit = req.query.limit || -1

    // Open the requested database
    const db = await req.orbitdb.open(address, {
      create: false,
      sync: true,
      localOnly: req.query.live ? !req.query.live : true,
    })

    // Load the database
    await db.load()

    const query = () => db.iterator({ limit: limit }).collect()

    // Loop if we're streaming the results
    if (shouldStream) {
      const queryAndRespond = () => {
        res.write(JSON.stringify({
          result: query()
        }))
      }
      db.events.on('replicated', queryAndRespond)
      db.events.on('write', queryAndRespond)
      res.on('end', () => console.log("FINISHED!"))
      queryAndRespond()
    } else {
      // Return the results
      res.send({
        result: query()
      })
    }
  } catch (e) {
    // TODO: return 404 if the database doesn't exist
    res.status(500).send({ error: e.toString() })
  }
}

module.exports = get
