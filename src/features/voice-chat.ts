import { VoiceChannel } from 'discord.js';
import { Middleware } from '../libs/middleware-manager';
import { fromBot, Parser, startsWith } from '../utils/parser';
import { validateVoiceChat } from '../utils/validate-voice-chat';

export const speakVoiceChat: Middleware = async (message, app, next) => {
  const { voiceText, voiceConnections } = app;

  const channelId = message.channel.id;
  const connection = voiceConnections.get(channelId);

  if (!connection) {
    next();
    return;
  }

  try {
    const validatedContent = validateVoiceChat(message.content);
    const audioFilePath = await voiceText.speak(validatedContent);
    connection.play(audioFilePath);
  } catch (e) {
    console.warn(e);
  }

  next();
  return;
};

export const leaveVoiceChat: Middleware = (message, context, next) =>
  new Parser(message)
    .filterNot(fromBot)
    .filter(startsWith('/leave'))
    .handle(async () => {
      const { member } = message;
      const { voiceConnections } = context;

      if (!member.voice.channel) {
        return message.channel.send(
          '発言者がボイスチャットに参加している場合のみ退出可能です',
        );
      }

      member.voice.channel.leave();
      voiceConnections.delete(message.channel.id);

      return message.channel.send('ボイスチャットから退出しました');
    })
    .catch(() => {
      next();
    });

export const joinVoiceChat: Middleware = async (message, context, next) =>
  new Parser(message)
    .filterNot(fromBot)
    .filter(startsWith('/join'))
    .option('channel', {
      type: 'string',
    })
    .handle(async ({ channel }) => {
      const { voiceConnections } = context;

      if (!channel) {
        return message.channel.send(
          '発言者がボイスチャットに参加している場合のみ参加可能です',
        );
      }

      const voiceChannel = context.client.channels.get(channel);

      if (!voiceChannel) {
        next();
        return;
      }

      const connection = await (voiceChannel as VoiceChannel).join();
      voiceConnections.set(message.channel.id, connection);

      return message.channel.send('ボイスチャットに参加しました');
    })
    .catch(() => {
      next();
    });
