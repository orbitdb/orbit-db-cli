/**
 * @poclif
 * The PoC Javascript CLI framework
**/

const fs = require('fs');
const exec = require('child_process').exec;

const poclifCommands    = require('./poclif-commands');
const poclifTypes       = require('./poclif-types');

let poclifExecName = undefined;

function PoclifInit(name) {
    const content = "#!/bin/node\nconsole.log('test');";

    poclifExecName = name;
    console.log(`->  The '${name}' exec was created.`);
    console.log(`    do ./${name} to execute your file.`);
    fs.writeFile(name, content, e => {
        if (e) { console.error(e); }
    });

    exec(`chmod +x ${name}`);
}

const poclif = {
    types:      poclifTypes,
    commands:   poclifCommands,
    init:       PoclifInit,
    isHere:     () => { console.log("Hello World !"); },
    fileName:   poclifExecName
}

module.exports = poclif;