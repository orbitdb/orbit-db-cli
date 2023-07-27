
import { Command } from '@oclif/core'

export default class Feed extends Command {
  static description = 'feed related commands'

  static examples = [
    '$ orbitdb feed --help',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    // name: Flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    // force: Flags.boolean({char: 'f'}),
  }

  static args = {
    // databaseName: Args.string({description: 'name of the database to create'}),
  }

  public async run(): Promise<void> {
    this.log(`feed basic command`)
  }
}