import { TextChannel } from 'discord.js';
import { Consumer } from '.';
import { filterMatches, filterNotBot } from '../operators';
import { fetchWebhook } from '../utils/fetch-webhook';
import { getNickname } from '../utils/get-nickname';
import { interpretMessageLike } from '../utils/message-like';
import { toQuotation } from '../utils/to-quotation';

const messageLikeRegexp = /^\>\s(?<messageLike>.+)/m;

export const quote: Consumer = context =>
  context.message$
    .pipe(filterNotBot, filterMatches(messageLikeRegexp))
    .subscribe(async message => {
      const { channel, content } = message;

      if (!(channel instanceof TextChannel) || !message.deletable) {
        return;
      }

      // Match quote message
      const match = messageLikeRegexp.exec(content);
      const plain = content.replace(messageLikeRegexp, '').trim();

      if (!match?.groups?.messageLike) {
        return;
      }

      // Find message from message-like
      const matchedMessage = await interpretMessageLike(
        match.groups.messageLike,
        message,
      );

      if (!matchedMessage) {
        return;
      }

      // Delete the original message
      await message.delete();

      const webhook = await fetchWebhook(context, channel);

      await webhook.send(plain, {
        embeds: [toQuotation(matchedMessage)],
        username: getNickname(message),
        avatarURL: message.author.avatarURL(),
      });
    });
