import * as Discord from 'discord.js';
import { config } from 'src/config';
import { Middleware } from 'src/libs/MiddlwareManager';
import { VoiceText } from 'src/libs/VoiceText';
import { validateVoiceChat } from 'src/utils/validateVoiceChat';

const client = new VoiceText(config.voiceTextToken);
const connections = new Map<string, Discord.VoiceConnection>();

/**
 * Play audio of validated content
 * @param message Message which recieved
 * @param next The next middleware
 */
export const voiceChat: Middleware = async (message, _, next) => {
  const channelId = message.channel.id;
  const connection = connections.get(channelId);

  if (!connection) {
    return next();
  }

  try {
    const validatedContent = validateVoiceChat(message.content);
    const audioFilePath = await client.speak(validatedContent);
    connection.playFile(audioFilePath);
  } catch {
    // VoiceText's error, ignored
  }

  return next();
};

/**
 * Control joined voice connection
 * @param message Message which recieved
 * @param next The next middleware
 */
export const controlVoiceConnections: Middleware = async (
  message,
  app,
  next,
) => {
  const channelId = message.channel.id;
  const { content, member } = message;

  if (message.author.bot || !message.isMentioned(app.client.user)) {
    return next();
  }

  if (/join/.test(content) && member) {
    if (!member.voiceChannel) {
      await message.reply(
        '発言者がボイスチャットに参加している場合のみ参加可能です',
      );
    } else {
      const connection = await member.voiceChannel.join();
      connections.set(channelId, connection);
      await message.reply('ボイスチャットに参加しました');
    }
  } else if (/leave/.test(content) && member && member.voiceChannel) {
    if (!member.voiceChannel) {
      await message.reply(
        '発言者がボイスチャットに参加している場合のみ退出可能です',
      );
    } else {
      await member.voiceChannel.leave();
      connections.delete(channelId);
      await message.reply('ボイスチャットから退出しました');
    }
  } else {
    return next();
  }
};
