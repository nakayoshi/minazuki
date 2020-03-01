import Discord from 'discord.js';

export const toMention = (user: Discord.User) => `<@${user.id}>`;
