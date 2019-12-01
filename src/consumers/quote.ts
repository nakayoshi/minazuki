import { TextChannel, User } from 'discord.js';
import { Consumer } from '.';
import { Context } from '../context';
import { filterMatches, filterNotBot } from '../operators';
import { getNickname } from '../utils/get-nickname';
import { interpretMessageLike } from '../utils/message-like';
import { toQuotation } from '../utils/to-quotation';

const fetchWebhookOrCreate = async (context: Context, channel: TextChannel) => {
  const webhook = await channel
    .fetchWebhooks()
    .then(webhooks =>
      webhooks.find(
        ({ owner }) =>
          owner instanceof User && owner.id === context.client.user?.id,
      ),
    );

  if (webhook) {
    return webhook;
  }

  return channel.createWebhook('minazuki');
};

const messageLikeRegexp = /\>\s(?<messageLike>.+)/;

export const quote: Consumer = context =>
  context.message$
    .pipe(filterNotBot, filterMatches(messageLikeRegexp))
    .subscribe(async message => {
      context.before(message);

      const { channel, content } = message;

      if (!(channel instanceof TextChannel) || !message.deletable) {
        return context.after(message);
      }

      // Match quote message
      const match = messageLikeRegexp.exec(content);
      const plain = content.replace(messageLikeRegexp, '').trim();

      if (!match?.groups?.messageLike) {
        return context.after(message);
      }

      // Find message from message-like
      const matchedMessage = await interpretMessageLike(
        match.groups.messageLike,
        message,
      );

      if (!matchedMessage) {
        return context.after(message);
      }

      context.after(message);

      // Delete the original message
      await message.delete();

      const webhook = await fetchWebhookOrCreate(context, channel);

      await webhook.send(plain, {
        embeds: [toQuotation(matchedMessage)],
        username: getNickname(message),
        avatarURL: message.author.avatarURL(),
      });
    });
