#!/bin/node

const av            = process.argv;
const folderPath    = arguments[1].main.path;
const thisFile      = arguments[1].main.filename;

const poclif = require(folderPath.concat("/poclif/poclif"));

function DisplayHelp() {
    console.log("USAGE");
}

function Main(av) {
    if (av.length == 0) {
        DisplayHelp();
    }
}

av.splice(0, 2);
Main(av)