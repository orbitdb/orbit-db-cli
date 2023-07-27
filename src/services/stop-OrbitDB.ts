// orbitdb: OrbitDB
const stopOrbitDB = async (orbitdb: any) => {
    try {
      await orbitdb._ipfs.stop();
      await orbitdb.stop();
    } catch (error) {
      console.error('An error occured while closing OrbitDB', error);
      throw new Error('An error occured while closing OrbitDB');
    }
  }
  
  export { stopOrbitDB };