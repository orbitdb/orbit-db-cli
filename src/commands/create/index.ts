import {Args, Command, Flags} from '@oclif/core'

export default class Add extends Command {
    static description = "Create a new database. Type can be one of: eventlog|feed|docstore|keyvalue|counter";

    async run() {
        this.log("Test");
    }
}