import {Args, Command, Flags} from '@oclif/core'

export default class Add extends Command {
    static description = "Import a CSV file to a document database";

    async run() {
        this.log("Test");
    }
}