"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
class Add extends core_1.Command {
    async run() {
        this.log("Test");
    }
}
exports.default = Add;
Add.description = "Add an entry to an eventlog or feed database. Can be only used on: eventlog|feed";
