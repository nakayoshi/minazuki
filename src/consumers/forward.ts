import { TextChannel } from 'discord.js';
import { Consumer } from '.';
import { filterMatches } from '../operators';
import { fetchWebhook } from '../utils/fetch-webhook';
import { getNickname } from '../utils/get-nickname';
import { interpretMessageLike } from '../utils/message-like';
import { toQuotation } from '../utils/to-quotation';

const messageUrlRegExp = /https:\/\/discordapp.com\/channels\/(?<server>.+)\/(?<channel>.+)\/(?<message>.+)/m;

export const forward: Consumer = context =>
  context.message$
    .pipe(filterMatches(messageUrlRegExp))
    .subscribe(async message => {
      if (!(message.channel instanceof TextChannel) || !message.deletable) {
        return;
      }

      const { content } = message;
      const match = messageUrlRegExp.exec(content);
      const plain = content.replace(messageUrlRegExp, '').trim();

      if (!match?.groups?.channel || !match?.groups?.message) {
        return;
      }

      const sourceChannel = context.client.channels.find(channel => {
        return channel.id === match?.groups?.channel;
      });

      if (!(sourceChannel instanceof TextChannel)) {
        return;
      }

      const matchedMessage = await interpretMessageLike(
        match.groups.message,
        message,
        sourceChannel,
      );

      if (!matchedMessage) {
        return;
      }

      await message.delete();
      const webhook = await fetchWebhook(context, message.channel);

      await webhook.send(plain, {
        embeds: [toQuotation(matchedMessage)],
        username: getNickname(message),
        avatarURL: message.author.avatarURL(),
      });
    });
