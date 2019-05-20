import { Middleware } from '../libs/middleware-manager';
import { validateVoiceChat } from '../utils/validate-voice-chat';

/**
 * Play audio of validated content
 * @param message Message which recieved
 * @param next The next middleware
 */
export const voiceChat: Middleware = async (message, app, next) => {
  const { voiceText, voiceConnections } = app;

  const channelId = message.channel.id;
  const connection = voiceConnections.get(channelId);

  if (!connection) {
    return next();
  }

  try {
    const validatedContent = validateVoiceChat(message.content);
    const audioFilePath = await voiceText.speak(validatedContent);
    connection.play(audioFilePath);
  } catch (e) {
    console.warn(e);
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
  const { client, voiceConnections } = app;

  const channelId = message.channel.id;
  const { content, member } = message;

  if (
    message.author.bot ||
    !client.user ||
    !message.mentions.has(client.user)
  ) {
    return next();
  }

  if (/join/.test(content) && member) {
    if (!member.voice.channel) {
      await message.reply(
        '発言者がボイスチャットに参加している場合のみ参加可能です',
      );
    } else {
      const connection = await member.voice.channel.join();
      voiceConnections.set(channelId, connection);
      await message.reply('ボイスチャットに参加しました');
    }
  } else if (/leave/.test(content) && member) {
    if (!member.voice.channel) {
      await message.reply(
        '発言者がボイスチャットに参加している場合のみ退出可能です',
      );
    } else {
      await member.voice.channel.leave();
      voiceConnections.delete(channelId);
      await message.reply('ボイスチャットから退出しました');
    }
  } else {
    return next();
  }
};
