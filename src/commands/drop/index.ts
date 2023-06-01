import {Args, Command, Flags} from '@oclif/core'

export default class Add extends Command {
    static description = "Remove a database locally. This doesn't remove data on other nodes that have the removed database replicated.";

    async run() {
        this.log("Test");
    }
}