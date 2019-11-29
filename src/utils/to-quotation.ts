import { Message, MessageEmbed } from 'discord.js';

export const toQuotation = (message: Message) => {
  const embed = new MessageEmbed()
    .setAuthor(
      message.author.tag,
      message.author.avatarURL({ format: 'png', size: 64 }),
      message.url,
    )
    .setDescription(message.content)
    .setFooter('引用')
    .setTimestamp(message.createdTimestamp);

  const thumbnail = message.attachments.first()?.url;
  if (thumbnail) embed.setThumbnail(thumbnail);

  return embed;
};
