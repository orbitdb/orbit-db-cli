const commands = []

const poclifCommands = {
    new: (value) => {
        commands.push(value)
    },
    print: () => {
        commands.forEach((n) => {
            console.log(`name:          \t${n.name}`);
            console.log(`description:   \t${n.description}`);
            console.log(`parametters:`);
            n.parametters.forEach((p, i) => {
                if (typeof(p[1]) == "number") {
                    console.log(`\t[${i}] \t${p[0]}:${p[1]}`);
                } else {
                    console.log(`\t[${i}] \t${p[0]}:[${p[1].array}]`);
                }
            })
            console.log(`executes       \t${n.executes}`);
        })
    }
}

module.exports = poclifCommands;