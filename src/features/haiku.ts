import path from 'path';
import { MatsuoBasho } from '../libs/matsuo-basho';
import { Middleware } from '../libs/middleware-manager';
import { fromBot, Parser } from '../utils/parser';

export const haiku: Middleware = async (message, _, next) =>
  new Parser(message)
    .filterNot(fromBot)
    .handle(async () => {
      const dict = path.resolve(require.resolve('kuromoji'), '../../dict');
      const basho = new MatsuoBasho([5, 7, 5], dict);
      const match = await basho.findHaiku(message.content);

      if (!match || !match.length) {
        next();
        return;
      }

      return message.channel.send(
        `*${match[0]}*` +
          `  *${match[1]}*` +
          `    *${match[2]}*` +
          `      ── ***${message.author.username}***`,
      );
    })
    .catch(() => {
      next();
    });
