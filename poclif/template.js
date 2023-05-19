#!/bin/node

const av            = process.argv;
const folderPath    = arguments[1].main.path;
const thisFile      = arguments[1].main.filename;

function InvalidCommand(cmd) {
    console.error(`${cmd}: \x1B[31mNot recognise as a command.\x1B[m`);
}

function Main(av) {
    if (av.length == 0 || av[0] == '--help' || av[0] == '-h') {
        return DisplayUsage();
    }
    return Cases(av[0]);
}
