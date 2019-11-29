import { ClientUser, TextChannel, User } from 'discord.js';
import { Consumer } from '.';
import { Context } from '../context';
import { filterNotBot, filterStartsWith } from '../operators';
import { interpretMessageLike } from '../utils/message-like';
import { toQuotation } from '../utils/to-quotation';

const fetchWebhookOrCreate = async (context: Context, channel: TextChannel) => {
  const webhook = await channel
    .fetchWebhooks()
    .then(webhooks =>
      webhooks.find(
        ({ owner }) =>
          owner instanceof User &&
          context.client.user instanceof ClientUser &&
          owner.id === context.client.user.id,
      ),
    );

  if (webhook) {
    return webhook;
  }

  return channel.createWebhook('minazuki');
};

export const quote: Consumer = context =>
  context.message$
    .pipe(filterNotBot, filterStartsWith('> '))
    .subscribe(async message => {
      context.before(message);
      const { channel, content } = message;

      if (!(channel instanceof TextChannel) || !message.deletable) {
        return context.after(message);
      }

      // Match quote message
      const match = /\>\s(?<messageLike>[^\s]+)/.exec(content);

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

      // Delete original message
      await message.delete();

      await fetchWebhookOrCreate(context, channel).then(webhook =>
        webhook.send(undefined, {
          username: message.author.username,
          avatarURL: message.author.avatarURL(),
          embeds: [toQuotation(matchedMessage)],
        }),
      );

      return context.after(message);
    });
