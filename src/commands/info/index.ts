import {Args, Command, Flags} from '@oclif/core'

export default class Add extends Command {
    static description = "Show information about a database";

    async run() {
        this.log("Test");
    }
}