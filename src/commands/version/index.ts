import {Args, Command, Flags} from '@oclif/core'

export default class Add extends Command {
    static description = "Show information about current orbit-db";

    async run() {
        this.log("Test");
    }
}