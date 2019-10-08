import { MessageEmbed } from 'discord.js';
import { Consumer } from '.';
import { filterNotBot, filterStartsWith } from '../operators';
import { interpretMessageLike } from '../utils/message-like';

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

      const quotation = await interpretMessageLike(
        match.groups.messageLike,
        message,
      );

      if (!quotation) {
        return channel.stopTyping(true);
      }

      const embed = new MessageEmbed()
        .setAuthor(
          quotation.author.tag,
          quotation.author.avatarURL({ size: 16 }),
          quotation.url,
        )
        .setDescription(quotation.content)
        .setTimestamp(quotation.createdTimestamp);

      channel.stopTyping(true);
      return channel.send(embed);
    });
