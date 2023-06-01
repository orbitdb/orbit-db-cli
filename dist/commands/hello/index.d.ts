import { Command } from '@oclif/core';
export default class Hello extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        from: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces/parser").CustomOptions>;
    };
    static args: {
        person: import("@oclif/core/lib/interfaces/parser").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
