"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
class Add extends core_1.Command {
    async run() {
        this.log("Test");
    }
}
exports.default = Add;
Add.description = "Remove a database locally. This doesn't remove data on other nodes that have the removed database replicated.";
