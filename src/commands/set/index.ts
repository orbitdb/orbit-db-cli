import {Args, Command, Flags} from '@oclif/core'

export default class Add extends Command {
    static description = "Set a value of a key in KeyValue database";

    async run() {
        this.log("Test");
    }
}