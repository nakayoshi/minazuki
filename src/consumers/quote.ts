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
    .pipe(
      filterNotBot,
      filterStartsWith('> '),
    )
    .subscribe(async message => {
      const { channel, content } = message;

      if (!(channel instanceof TextChannel)) {
        return;
      }

      // tslint:disable-next-line no-floating-promises
      channel.startTyping();

      // Match quote message
      const match = /\>\s(?<messageLike>[^\s]+)/.exec(content);
      if (!match || !match.groups || !match.groups.messageLike) {
        return channel.stopTyping(true);
      }

      // Find message from message-like
      const matchedMessage = await interpretMessageLike(
        match.groups.messageLike,
        message,
      );
      if (!matchedMessage) {
        return channel.stopTyping(true);
      }

      // Delete original message
      if (message.deletable) {
        await message.delete();
      }

      const webhook = await fetchWebhookOrCreate(context, channel);
      await webhook.send(undefined, {
        username: message.author.username,
        avatarURL: message.author.avatarURL(),
        embeds: [toQuotation(matchedMessage)],
      });

      return channel.stopTyping(true);
    });
