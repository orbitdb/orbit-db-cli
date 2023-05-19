const fs = require('fs');
const exec = require('child_process').exec;

const functionList = [];

function GenerateUsage(poclif, name) {
    const lines = [
        "function DisplayUsage() {",
        "console.log('" + name + "\\n');",
        "console.log('\x1B[1mUSAGE\x1B[m');",
        "console.log('  Test');",
        "console.log('');",
    ];
    lines.push("console.log('\x1B[1mCOMMANDS\x1B[m');");
    poclif.commands.commands.forEach((n) => {
        if (n.name == undefined) {
            return;
        }
        const param = [];
        n.parametters.forEach((p) => {
            param.push(p[0]);
        });

        const justify = 40;
        const main = '  $ ' + n.name + ((param.length > 0) ? (' [' + param.join('] [') + ']') : "");
        const gap = (justify - main.length);

        lines.push("console.log('" + main + "'+(' '.repeat(" + gap + "))+'\x1B[2m'+'" + n.description + "'+'\x1B[m');");
    })
    lines.push("console.log('');");
    lines.push("}\n");
    return lines.join('\n') + '\n';
}

function GenerateCases(poclif) {
    const lines = [
        "function Cases(name) {",
        "switch (name) {"
    ];
    poclif.commands.commands.forEach((e) => {
        if (e.name == undefined) {
            return;
        }
        lines.push("case '" + e.name + "':");
        lines.push(e.executes.name + "();");
        lines.push("break;");
        functionList.push(e.executes.toString());
    });

    lines.push("default:");
    lines.push("return InvalidCommand(av[0]);");
    lines.push("}")
    lines.push("}\n")
    return lines.join('\n') + '\n';
}

function CreateFile(poclif, name) {
    exec(`cp -r ${__dirname}/template.js ${name}`);
    fs.appendFile(name, '\n', (e) => {if (e) {throw(e)}});
    fs.appendFile(name, GenerateUsage(poclif, name), (e) => {if (e) {throw(e)}});
    fs.appendFile(name, GenerateCases(poclif), (e) => {if (e) {throw(e)}});
    functionList.forEach((n) => {
        fs.appendFile(name, n + '\n', (e) => {if (e) {throw(e)}});
    })
}

function PoclifCreate(poclif, name) {
    CreateFile(poclif, name);

    fs.appendFile(name, "av.splice(0, 2); Main(av)\n", (e) => {if (e) {throw(e)}});
    exec(`chmod +x ${name}`);

    console.log(`->  The '${name}' exec was created.`);
    console.log(`    do ./${name} to execute your file.`);
}

module.exports = PoclifCreate;