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
      context.before(message);

      const { content, channel } = message;
      const args = ForwardProps.decode(yargsParser(content));

      if (isLeft(args)) {
        return context.after(message);
      }

      const sourceChannel = context.client.channels.get(args.right.from);

      if (
        !(
          sourceChannel instanceof TextChannel ||
          sourceChannel instanceof DMChannel
        )
      ) {
        return context.after(message);
      }

      const matchedMessage = await interpretMessageLike(
        `${args.right._[1]}`,
        message,
        sourceChannel,
      );

      if (!matchedMessage) {
        return context.after(message);
      }

      const embed = toQuotation(matchedMessage);
      await channel.send(embed);

      return context.after(message);
    });
