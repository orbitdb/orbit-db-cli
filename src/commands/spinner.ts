import { Command, ux } from '@oclif/core'
import * as cliProgress from 'cli-progress';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default class Spinner extends Command {
  static description = 'Displays a spinner';

  async run() {
    ux.action.start('Loading')
    await delay(3000);
    ux.action.stop()

    ux.action.start('Starting', 'Init tasks (3)', {stdout: true})
    await delay(1000);
    ux.action.status = 'Task 1';
    await delay(1000);
    ux.action.status = 'Task 2';
    await delay(1000);
    ux.action.status = 'Task 3';
    await delay(3000);
    ux.action.stop('Completed !');

    this.log('Downloading stuff...')
    const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progress.start(100, 0);
    for (var i = 0; i <= 100; ++i) {
        await delay(100);
        progress.update(i);
    }
    progress.stop();
    this.log("Downloaded !")
  }
}