import * as Discord from 'discord.js';
import * as path from 'path';
import MatsuoBasho from '../utils/MatsuoBasho';
import verticalize from '../utils/verticalize';

export async function haiku (message: Discord.Message, next: () => void) {
  if (message.author.bot) {
    return next();
  }

  const dict  = path.join(__dirname, '../../node_modules/kuromoji/dict/');
  const basho = new MatsuoBasho([5, 7, 5], dict);
  const haiku = await basho.findHaiku(message.content);

  if (haiku.length !== 0) {
    message.reply('\n' + verticalize(`
${haiku[0]}
　　${haiku[1]}
　　　　${haiku[2]}
　　　　　　　${message.author.username}`));
  } else {
    return next();
  }
}
