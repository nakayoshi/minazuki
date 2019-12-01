import { Message, MessageEmbed } from 'discord.js';
import { getNickname } from './get-nickname';

export const toQuotation = (message: Message) => {
  const avatar = message.author.avatarURL({ format: 'png', size: 64 });

  const embed = new MessageEmbed()
    .setAuthor(getNickname(message), avatar, message.url)
    .setDescription(message.content)
    .setFooter('引用')
    .setTimestamp(message.createdTimestamp);

  const thumbnail = message.attachments.first()?.url;
  if (thumbnail) embed.setThumbnail(thumbnail);

  return embed;
};
