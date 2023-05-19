/**
 * @poclif
 * The PoC Javascript CLI framework
**/

const poclifCommands    = require('./poclif-commands');
const poclifTypes       = require('./poclif-types');
const PoclifCreate      = require('./poclif-exec');

const poclif = {
    types:      poclifTypes,
    commands:   poclifCommands,
    create:     (name) => { PoclifCreate(poclif, name) },
    isHere:     () => { console.log("PoClif functions here !"); },
}

module.exports = poclif;