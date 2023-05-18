const poclif = require('../poclif/poclif');

poclif.init("orbitdb")

function HelloWorld(infos) {
    console.log(infos.flags);
    console.log();
}

poclif.commands.new({
    name: 'create',

    description: "Create a new database. Type can be one of: eventlog|feed|docstore|keyvalue|counter",

    parametters: [
        ["database", poclif.types.string],
        ["type", poclif.types.enum(
            ['eventlog', 'feed', 'docstore', 'keyvalue', 'counter'])
        ]
    ],

    executes: HelloWorld
});

//poclif.commands.print();