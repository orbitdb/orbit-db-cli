import {Args, Command, Flags} from '@oclif/core'

export default class Add extends Command {
    static description = "Runs a sequence of commands as an example";

    async run() {
        this.log("Test");
    }
}