import { MessageEmbed } from 'discord.js';
import { Consumer } from '.';
import { filterNotBot, filterStartsWith } from '../operators';

export const quote: Consumer = context =>
  context.message$
    .pipe(
      filterNotBot,
      filterStartsWith('>'),
    )
    .subscribe(async message => {
      // tslint:disable-next-line no-floating-promises
      message.channel.startTyping();

      const match = /\>\s?(?<query>[^\s]+)/.exec(message.content);

      if (!match || !match.groups || !match.groups.query) {
        return message.channel.stopTyping(true);
      }

      const { query } = match.groups;

      const quotedMessage = await message.channel.messages
        .fetch({ limit: 100 })
        .then(messages =>
          messages.find(m => m.id !== message.id && m.content.includes(query)),
        );

      if (!quotedMessage) {
        return message.channel.stopTyping(true);
      }

      const embed = new MessageEmbed()
        .setAuthor(
          quotedMessage.author.tag,
          quotedMessage.author.avatarURL({ size: 16 }),
          quotedMessage.url,
        )
        .setDescription(quotedMessage.content)
        .setTimestamp(quotedMessage.createdTimestamp);

      message.channel.stopTyping(true);
      return message.channel.send(embed);
    });
