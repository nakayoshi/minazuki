import * as Discord from 'discord.js';
import Middleware from '.';
import Wikipedia from '../utils/Wikipedia';

const client = new Wikipedia();

/**
 * Search an Wikipedia article
 * @param message Message recieved
 * @param next The next middleware
 */
async function wikipedia (message: Discord.Message, next: () => void): Promise<void> {
  const { content } = message;

  if (/^\/wiki/.test(content)) {
    const [, query] = content.match(/^\/wiki\s(.+?)$/) as string[];

    if ( !query ) {
      message.reply('キーワードを指定してくだせー');
    }

    const page = await client.search(query);

    if (!page) {
      await message.reply('記事が見つからなかったです。');
    }

    const summary = await page.summary();

    await message.reply(`${summary}\n\n${page.raw.fullurl}`);

  } else {
    next();
  }
}

Middleware.append(wikipedia);
