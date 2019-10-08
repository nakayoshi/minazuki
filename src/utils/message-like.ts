import { Message } from 'discord.js';

export const interpretMessageLike = async (
  messageLike: string,
  parentMessage: Message,
) => {
  const { channel } = parentMessage;

  // Query by its ID
  if (/^[0-9]+$/.test(messageLike)) {
    return channel.messages.fetch(messageLike);
  }

  // Query by partial message
  const messages = await channel.messages
    .fetch({ limit: 100 })
    .then(collection => collection.array());

  return messages.find(message => {
    if (message.id === parentMessage.id) {
      return false;
    }

    if (!message.content.includes(messageLike)) {
      return false;
    }

    return true;
  });
};
