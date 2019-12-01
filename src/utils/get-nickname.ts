import { Message } from 'discord.js';

export const getNickname = (message: Message) => {
  const member = message.guild.member(message.author);

  if (member) {
    return member.displayName;
  }

  return message.author.tag;
};
