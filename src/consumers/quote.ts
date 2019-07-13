import { MessageEmbed } from 'discord.js';
import { filter } from 'rxjs/operators';
import { Consumer } from '.';

export const quote: Consumer = context =>
  context.message$
    .pipe(
      filter(message => !message.author.bot && message.content.startsWith('>')),
    )
    .subscribe(async message => {
      const match = /^\>\s?(?<query>[\s]+?)/.exec(message.content);

      if (!match || !match.groups || !match.groups.query) {
        return;
      }

      const { query } = match.groups;

      //tslint:disable-next-line no-unsafe-any
      const messages = await message.channel.messages.fetch({
        limit: 100,
      });

      const hitMessage = messages.find(
        m => m.id !== message.id && m.content.includes(query),
      );
      if (!hitMessage) return;

      const embed = new MessageEmbed()
        .setAuthor(
          hitMessage.author.tag,
          hitMessage.author.avatarURL({ size: 16 }),
          hitMessage.url,
        )
        .setDescription(hitMessage.content)
        .setTimestamp(hitMessage.createdTimestamp);

      return message.channel.send(embed);
    });
