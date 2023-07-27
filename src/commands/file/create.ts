import { Command, Flags } from '@oclif/core';


export default class Create extends Command {
  static description = 'Create a file type database'

  static flags = {
    // flag with a value (-n VALUE, --name=VALUE)
    name: Flags.string({ char: 'n', description: 'name of the database', required: true }),
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: 'f', description: 'force overwrite if DB already exists' }),
  }

  public async run(): Promise<void> {
    this.log("Test")
  }
}