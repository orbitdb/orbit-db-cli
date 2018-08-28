const add = async (req, res) => {
  // TODO: validate database type to be 'log' or 'feed'
  try {
    // Get the database address from the request
    const address = req.params[0]

    // Get the entry to add
    const data = req.body

    // Check if the incoming request is a stream
    const isStream = req.headers['content-type'] === 'application/octet-stream'

    if (!data && !isStream)
      throw new Error('Database entry was undefined')

    // Open the requested database
    const db = await req.orbitdb.open(address, {
      create: false,
      sync: false,
    })

    // Load the database
    await db.load()

    // Handle incoming stream
    if (isStream) {
      let addedHashes = []
      req.setEncoding('utf8')

      req.on('data', async (chunk) => { 
        const hash = await db.add(chunk)
        addedHashes.push(hash)
      })

      req.on('end', function() {
        res.send(addedHashes)
      })
    } else {
      // Query for all results
      const hash = await db.add(data)

      // Get the added entry
      const entry = db._oplog.get(hash)

      // Return the hash and the entry
      res.send(entry)
    }
  } catch (e) {
    // TODO: return 404 if the database doesn't exist
    res.status(500).send({ error: e.toString() })
  }
}

module.exports = add
