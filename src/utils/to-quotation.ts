import { Message, MessageEmbed } from 'discord.js';

export const toQuotation = (message: Message) => {
  return new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL(), message.url)
    .setDescription(message.content)
    .setTimestamp(message.createdTimestamp);
};
