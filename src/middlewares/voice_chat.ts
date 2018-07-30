import * as Discord from 'discord.js';
import Middleware from '.';
import config from '../config';
import validateVoiceChat from '../utils/validateVoiceChat';
import VoiceText from '../utils/VoiceText';

const client = new VoiceText(config.voiceTextToken);
const connections: { [key: string]: Discord.VoiceConnection } = {};

/**
 * Play audio of validated content
 * @param message Message which recieved
 * @param next The next middleware
 */
async function voiceChat (message: Discord.Message, next: () => void) {
  const channelId  = message.channel.id;

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

  next();
}

/**
 * Control joined voice connection
 * @param message Message which recieved
 * @param next The next middleware
 */
async function controlConnections (message: Discord.Message, next: () => void): Promise<void> {
  const channelId = message.channel.id;
  const { content, member } = message;

  if (/^\/join/.test(content)) {
    if (!member.voiceChannel) {
      await message.reply('発言者がボイスチャットに参加している場合のみ参加可能です');
    } else {
      connections[channelId] = await member.voiceChannel.join();
      await message.reply('ボイスチャットに参加しました');
    }

  } else if (/^\/leave/.test(content) && member.voiceChannel) {
    if (!member.voiceChannel) {
      await message.reply('発言者がボイスチャットに参加している場合のみ退出可能です');
    } else {
      await member.voiceChannel.leave();
      delete connections[channelId];
      await message.reply('ボイスチャットから退出しました');
    }

  } else {
    next();
  }
}

Middleware.append(voiceChat, controlConnections);
