import {Args, Command, Flags} from '@oclif/core'

export default class Add extends Command {
    static description = "Add a document to a document database";

    async run() {
        this.log("Test");
    }
}