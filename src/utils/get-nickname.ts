import { Message } from 'discord.js';

export const getNickname = (message: Message) => {
  if (!message.guild) {
    return message.author.username;
  }

  const senderMembership = message.guild.members.find(
    member => member.id === message.author.id,
  );

  return senderMembership.nickname;
};
