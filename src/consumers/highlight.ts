import Discord from 'discord.js';
import { filter } from 'rxjs/operators';
import { Consumer } from '.';
import { Raw } from '../context';
import { toEmbed } from '../utils/to-embed';
import { toMention } from '../utils/to-mention';

// Magic-topic
const HIGHLIGHTS = '__HIGHLIGHTS__';

// Threshold to highlight
const THRESHOLD = 5;

interface ReactionPayload {
  user_id: string;
  message_id: string;
  member: {
    user: {
      username: string;
      id: string;
      discriminator: string;
      avatar: string;
    };
    roles: string[];
    premium_since: string;
    nick: string;
    mute: boolean;
    joined_at: string;
    hoisted_role: string;
    deaf: boolean;
  };
  emoji: {
    name: string;
    id: string;
  };
  channel_id: string;
  guild_id: string;
}

const isMessageReactionAdd = (data: [Raw]): data is [Raw<ReactionPayload>] =>
  data[0].t === 'MESSAGE_REACTION_ADD';

const highlightChannelCache = new Map<string, string>();

const findHighlightChannel = (guild: Discord.Guild) => {
  const cachedId = highlightChannelCache.get(guild.id);

  const channel = cachedId
    ? guild.channels.get(cachedId)
    : guild.channels.find(
        c =>
          c instanceof Discord.TextChannel &&
          !!c.topic &&
          c.topic.includes(HIGHLIGHTS),
      );

  if (!cachedId && channel) {
    highlightChannelCache.set(guild.id, channel?.id);
  }

  return channel instanceof Discord.TextChannel ? channel : undefined;
};

const countMeaningfulReactions = (reactions: Discord.ReactionStore) =>
  reactions
    .array()
    .reduce<number>(
      (count, reaction) =>
        count + reaction.users.filter(user => !user.bot).size,
      0,
    );

export const highlight: Consumer = context =>
  context.raw$
    .pipe(filter(isMessageReactionAdd))
    .subscribe(async ([packet]) => {
      const { channel_id, message_id } = packet.d;

      const channel = await context.client.channels.fetch(channel_id);
      if (!(channel instanceof Discord.TextChannel)) return;

      const message = await channel.messages.fetch(message_id);
      const count = countMeaningfulReactions(message.reactions);

      if (count < THRESHOLD || count % THRESHOLD !== 0) {
        return;
      }

      const highlightChannel = findHighlightChannel(channel.guild);
      if (!highlightChannel) return;

      await highlightChannel.send(
        `🎉 ${toMention(
          message.member.user,
        )}さんの投稿が${count}リアクションを獲得しました！`,
        {
          embed: toEmbed(message),
        },
      );
    });
