import * as Discord from 'discord.js';
import * as path from 'path';
import MatsuoBasho from '../utils/MatsuoBasho';

export async function haiku (message: Discord.Message, next: () => void) {
  if (message.author.bot) {
    return next();
  }

  const dict  = path.join(__dirname, '../../node_modules/kuromoji/dict/');
  const basho = new MatsuoBasho([5, 7, 5], dict);
  const haiku = await basho.findHaiku(message.content);

  if (haiku.length !== 0) {
    message.reply(`
*${haiku[0]}*
　　*${haiku[1]}*
　　　　*${haiku[2]}*
　　　　　　　── ***${message.author.username}***`);
  } else {
    return next();
  }
}

export async function tanka (message: Discord.Message, next: () => void) {
  if (message.author.bot) {
    return next();
  }

  const dict  = path.join(__dirname, '../../node_modules/kuromoji/dict/');
  const basho = new MatsuoBasho([5, 7, 5, 7, 7], dict);
  const tanka = await basho.findHaiku(message.content);

  if (tanka.length !== 0) {
    message.reply(`
*${tanka[0]}*
　　*${tanka[1]}*
　　　　*${tanka[2]}*
　　　　　　*${tanka[3]}*
　　　　　　　　*${tanka[4]}*
　　　　　　　　　　　── ***${message.author.username}***`);
  } else {
    return next();
  }
}
