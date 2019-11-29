import { Message } from 'discord.js';
import { filter } from 'rxjs/operators';

export const filterNotBot = filter<Message>(message => !message.author.bot);

export const filterStartsWith = (text: string) =>
  filter<Message>(message => message.content.startsWith(text));
