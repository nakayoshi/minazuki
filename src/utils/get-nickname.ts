import { GuildMember, Message } from 'discord.js';

export const getNickname = (message: Message) => {
  if (message.author instanceof GuildMember) {
    return message.author.nickname;
  }

  return message.author.username;
};
