import { Args, Command, Flags } from '@oclif/core'
import { manager, ManagerInfos } from '../manager';

const name = 'KeyValue'

export default class KeyValueCommand extends Command {
  static description = 'Method for ' + name + 's.'

  static flags = {}

  static args = {
    action: Args.string({
      description: 'The action you want to apply to the datastore type',
      required: false
    }),
  };

  static examples = [
    `mydatabase ${name.toLowerCase()} add`,
    `mydatabase ${name.toLowerCase()} create`,
    `mydatabase ${name.toLowerCase()} remove`
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(KeyValueCommand)

    const infos: ManagerInfos = {
      method: name,
      action: args.action as string,
      flags: flags,
    };

    manager(infos);
  }
}