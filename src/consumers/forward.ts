import { DMChannel, TextChannel } from 'discord.js';
import { isLeft } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import yargsParser from 'yargs-parser';
import { Consumer } from '.';
import { filterNotBot, filterStartsWith } from '../operators';
import { interpretMessageLike } from '../utils/message-like';
import { toQuotation } from '../utils/to-quotation';

const ForwardProps = t.type({
  _: t.tuple([t.literal('/forward'), t.string]),
  from: t.string,
});

export const forward: Consumer = context =>
  context.message$
    .pipe(
      filterNotBot,
      filterStartsWith('/forward'),
    )
    .subscribe(async message => {
      const { content, channel } = message;
      // console.log(`caught ${content}`);
      const args = ForwardProps.decode(yargsParser(content));
      // console.log(`caught ${JSON.parse(args)}`);
      if (isLeft(args)) return;

      const sourceChannel = context.client.channels.get(args.right.from);

      if (
        !(
          sourceChannel instanceof TextChannel ||
          sourceChannel instanceof DMChannel
        )
      ) {
        return;
      }

      const matchedMessage = await interpretMessageLike(
        `${args.right._[1]}`,
        message,
        sourceChannel,
      );

      if (!matchedMessage) {
        return;
      }

      const embed = toQuotation(matchedMessage);
      return channel.send(embed);
    });
