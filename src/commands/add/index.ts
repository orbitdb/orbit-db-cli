import {Args, Command, Flags} from '@oclif/core'

export default class Add extends Command {
    static description = "Add an entry to an eventlog or feed database. Can be only used on: eventlog|feed";

    async run() {
        this.log("Test");
    }
}