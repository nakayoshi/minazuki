import * as Discord from 'discord.js';
import minazukiBot from '../main';
import Wikipedia from '../utils/Wikipedia';

const client = new Wikipedia();

/**
 * Search an Wikipedia article
 * @param message Message recieved
 * @param next The next middleware
 */
export async function wikipedia (message: Discord.Message, next: () => void): Promise<any> {
  const { content } = message;

  if (message.author.bot || !message.isMentioned(minazukiBot.client.user)) {
    return next();
  }

  if (/wiki/.test(content)) {
    const result = content.match(/wiki\s?(.+?)$/);

    if ( !result ) {
      return message.reply('キーワードを指定してくだせー');
    }

    const query = result[1];
    const page  = await client.search(query);

    if (!page) {
      return message.reply('記事が見つからなかったです。');
    }

    let summary = await page.summary();
    summary = summary.replace(/\n/g, ' ');
    summary = summary.substr(0, 200) + '...';

    message.reply(`
${summary}
https://ja.wikipedia.org/wiki?curid=${page.raw.pageid}`);

  } else {
    return next();
  }
}
