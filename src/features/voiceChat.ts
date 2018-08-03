import * as Discord from 'discord.js';
import config from '../config';
import minazukiBot from '../main';
import validateVoiceChat from '../utils/validateVoiceChat';
import VoiceText from '../utils/VoiceText';

const client = new VoiceText(config.voiceTextToken);
const connections: { [key: string]: Discord.VoiceConnection } = {};

/**
 * Play audio of validated content
 * @param message Message which recieved
 * @param next The next middleware
 */
export async function voiceChat (message: Discord.Message, next: () => void) {
  const channelId = message.channel.id;

  if (connections[channelId]) {
    const connection       = connections[channelId];
    const validatedContent = validateVoiceChat(message.content);

    try {
      const audioPath = await client.speak(validatedContent);
      connection.playFile(audioPath);
    } catch {
      // VoiceText's error, ignored
    }
  }

  return next();
}

/**
 * Control joined voice connection
 * @param message Message which recieved
 * @param next The next middleware
 */
export async function controlVoiceConnections (message: Discord.Message, next: () => void): Promise<void> {
  const channelId = message.channel.id;
  const { content, member } = message;

  if (message.author.bot || !message.isMentioned(minazukiBot.client.user)) {
    return next();
  }

  if (/join/.test(content) && member) {
    if (!member.voiceChannel) {
      await message.reply('発言者がボイスチャットに参加している場合のみ参加可能です');
    } else {
      connections[channelId] = await member.voiceChannel.join();
      await message.reply('ボイスチャットに参加しました');
    }

  } else if (/leave/.test(content) && member && member.voiceChannel) {
    if (!member.voiceChannel) {
      await message.reply('発言者がボイスチャットに参加している場合のみ退出可能です');
    } else {
      await member.voiceChannel.leave();
      delete connections[channelId];
      await message.reply('ボイスチャットから退出しました');
    }

  } else {
    return next();
  }
}
