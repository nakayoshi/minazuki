import * as path from 'path';
import { MatsuoBasho } from '../libs/MatsuoBasho';
import { Middleware } from '../libs/MiddlwareManager';

export const haiku: Middleware = async (message, _, next) => {
  if (message.author.bot) {
    return next();
  }

  const dict = path.join(__dirname, '../../node_modules/kuromoji/dict/');
  const basho = new MatsuoBasho([5, 7, 5], dict);
  const match = await basho.findHaiku(message.content);

  if (haiku.length !== 0) {
    message.reply(`
*${match[0]}*
　　*${match[1]}*
　　　　*${match[2]}*
　　　　　　　── ***${message.author.username}***`);
  } else {
    return next();
  }
};

export const tanka: Middleware = async (message, _, next) => {
  if (message.author.bot) {
    return next();
  }

  const dict = path.join(__dirname, '../../node_modules/kuromoji/dict/');
  const basho = new MatsuoBasho([5, 7, 5, 7, 7], dict);
  const match = await basho.findHaiku(message.content);

  if (tanka.length !== 0) {
    message.reply(`
*${match[0]}*
　　*${match[1]}*
　　　　*${match[2]}*
　　　　　　*${match[3]}*
　　　　　　　　*${match[4]}*
　　　　　　　　　　　── ***${message.author.username}***`);
  } else {
    return next();
  }
};
