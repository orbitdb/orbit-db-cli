
import { Command } from '@oclif/core'

export default class File extends Command {
  static description = 'file related commands'

  static examples = [
    '$ orbitdb file --help',
  ]

  static flags = {}

  static args = {}

  public async run(): Promise<void> {
    this.log(`file basic command`)
  }
}