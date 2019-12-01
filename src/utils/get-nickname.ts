import { Message } from 'discord.js';

export const getNickname = (message: Message) => {
  if (message.guild) {
    const member = message.guild.member(message.author);
    return member.displayName;
  }

  return message.author.tag;
};
