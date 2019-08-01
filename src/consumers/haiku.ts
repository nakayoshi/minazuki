import path from 'path';
import { Consumer } from '.';
import { filterNotBot } from '../operators';
import { MatsuoBasho } from '../utils/matsuo-basho';

export const haiku: Consumer = async context =>
  context.message$.pipe(filterNotBot).subscribe(async message => {
    const dict = path.resolve(require.resolve('kuromoji'), '../../dict');
    const basho = new MatsuoBasho([5, 7, 5], dict);
    const match = await basho.findHaiku(message.content);

    if (!match || !match.length) {
      return;
    }

    return message.channel.send(
      `*${match[0]}*\n` +
        `　　*${match[1]}*\n` +
        `　　　　*${match[2]}*\n` +
        `　　　　　　── ***${message.author.username}***`,
    );
  });
