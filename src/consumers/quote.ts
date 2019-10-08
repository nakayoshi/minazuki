import { Consumer } from '.';
import { filterNotBot, filterStartsWith } from '../operators';
import { interpretMessageLike } from '../utils/message-like';
import { toQuotation } from '../utils/to-quotation';

export const quote: Consumer = context =>
  context.message$
    .pipe(
      filterNotBot,
      filterStartsWith('> '),
    )
    .subscribe(async message => {
      const { channel, content } = message;

      // tslint:disable-next-line no-floating-promises
      channel.startTyping();

      const match = /\>\s(?<messageLike>[^\s]+)/.exec(content);

      if (!match || !match.groups || !match.groups.messageLike) {
        return channel.stopTyping(true);
      }

      const matchedMessage = await interpretMessageLike(
        match.groups.messageLike,
        message,
      );

      if (!matchedMessage) {
        return channel.stopTyping(true);
      }

      const embed = toQuotation(matchedMessage);
      channel.stopTyping(true);
      return channel.send(embed);
    });
