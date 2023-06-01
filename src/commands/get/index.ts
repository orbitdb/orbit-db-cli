import {Args, Command, Flags} from '@oclif/core'

export default class Add extends Command {
    static description = "Query the database.";

    async run() {
        this.log("Test");
    }
}