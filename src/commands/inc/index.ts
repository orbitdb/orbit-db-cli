import {Args, Command, Flags} from '@oclif/core'

export default class Add extends Command {
    static description = "Increase the value of a counter database. Default increment is 1.";

    async run() {
        this.log("Test");
    }
}