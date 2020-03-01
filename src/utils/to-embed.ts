import Discord from 'discord.js';
import { getNickname } from './get-nickname';

export const toEmbed = (message: Discord.Message) => {
  const avatar = message.author.avatarURL({ format: 'png', size: 64 });
  const title =
    message.channel instanceof Discord.TextChannel
      ? message.channel.name
      : message.channel.id;

  const embed = new Discord.MessageEmbed()
    .setTitle(`#${title}`)
    .setDescription(message.content)
    .setURL(message.url)
    .setAuthor(getNickname(message), avatar)
    .setTimestamp(message.createdTimestamp)
    .setFooter('Quote');

  const image = message.attachments.first();
  if (image) embed.setImage(image.url);

  return embed;
};
