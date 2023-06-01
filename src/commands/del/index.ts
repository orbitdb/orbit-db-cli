import {Args, Command, Flags} from '@oclif/core'

export default class Add extends Command {
    static description = "Delete an entry from a database. Only valid for data types of: docstore|keyvalue|feed";

    async run() {
        this.log("Test");
    }
}