import { VoiceChannel } from 'discord.js';
import { isLeft } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { filter } from 'rxjs/operators';
import { oc } from 'ts-optchain';
import yargsParser from 'yargs-parser';
import { Consumer } from '.';
import { validateVoiceChat } from '../utils/validate-voice-chat';

export const speakVoiceChat: Consumer = async context =>
  context.message$.subscribe(async message => {
    const { voiceText } = context;

    const connection = context.client.voiceConnections.find(
      c => c.channel.guild.id === oc(message).guild.id(),
    );

    if (!connection) return;

    try {
      const validatedContent = validateVoiceChat(message.content);
      const audioFilePath = await voiceText.speak(validatedContent);
      connection.play(audioFilePath);
    } catch (e) {
      console.warn(e);
    }
  });

const LeaveProps = t.type({
  _: t.tuple([t.literal('/leave')]),
  channel: t.union([t.string, t.undefined]),
});

export const leaveVoiceChat: Consumer = context =>
  context.message$
    .pipe(
      filter(
        message => !message.author.bot && message.content.startsWith('/leave'),
      ),
    )
    .subscribe(async message => {
      const args = LeaveProps.decode(yargsParser(message.content));
      if (isLeft(args)) return;

      // VoiceConnection of same guild
      const guildsConnection = context.client.voiceConnections.find(
        c => c.channel.guild.id === oc(message).guild.id(),
      );

      const { channel = oc(guildsConnection).channel.id() } = args.right;

      if (!channel) {
        return message.channel.send('参加中のボイスチャットはありません');
      }

      const voiceChannel = context.client.channels.get(channel);

      if (!voiceChannel || !(voiceChannel instanceof VoiceChannel)) {
        return message.channel.send('指定されたチャンネルは存在しません');
      }

      voiceChannel.leave();
      return message.channel.send('ボイスチャットから退出しました');
    });

const JoinProps = t.type({
  _: t.tuple([t.literal('/join')]),
  channel: t.union([t.string, t.undefined]),
});

export const joinVoiceChat: Consumer = async context =>
  context.message$
    .pipe(filter(message => !message.author.bot))
    .subscribe(async message => {
      const args = JoinProps.decode(yargsParser(message.content));
      if (isLeft(args)) return;

      // Set default `channel` arg to the ID of the channel which sender currently join
      const senderVoiceChannel = oc(message).member.voice.channel.id();
      const { channel = senderVoiceChannel } = args.right;

      if (!channel) {
        return message.channel.send(
          '発言者がボイスチャットに参加している場合のみ参加可能です',
        );
      }

      const voiceChannel = context.client.channels.get(channel);

      if (!voiceChannel || !(voiceChannel instanceof VoiceChannel)) {
        return message.channel.send('指定されたチャンネルは存在しません');
      }

      await voiceChannel.join();
      return message.channel.send('ボイスチャットに参加しました');
    });
