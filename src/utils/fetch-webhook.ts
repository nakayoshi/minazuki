import { TextChannel, User } from 'discord.js';
import { Context } from '../context';

export const fetchWebhook = async (context: Context, channel: TextChannel) => {
  const webhooks = await channel.fetchWebhooks();
  const webhook = webhooks.find(({ owner }) => {
    return owner instanceof User && owner.id === context.client.user?.id;
  });

  if (webhook) {
    return webhook;
  }

  return channel.createWebhook('minazuki');
};
