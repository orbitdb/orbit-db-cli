import {Args, Command, Flags} from '@oclif/core'

export default class Add extends Command {
    static description = "Replicate a database with peers.";

    async run() {
        this.log("Test");
    }
}