import { Message, MessageEmbed } from 'discord.js';
import WikiJS from 'wikijs';
import { Middleware } from '../libs/middleware-manager';
import { fromBot, Parser, startsWith } from '../utils/parser';

interface WikipediaHandlerParams {
  message: Message;
  query: string;
  host: string;
}

const wikipediaHandler = async (params: WikipediaHandlerParams) => {
  const { message, query, host } = params;

  const wikijs = WikiJS({
    apiUrl: `https://${host}/w/api.php`,
  });

  const { results } = await wikijs.search(query);

  if (!results.length) {
    return message.reply('記事が見つからなかったです。');
  }

  const page = await wikijs.page(results[0]);

  const mainImage = await page.mainImage();
  const summary = (await page.summary())
    .replace(/\n/g, ' ')
    .substr(0, 200)
    .concat('...');

  const safeURL = `https://${host}/wiki?curid=${(page as any).raw.pageid}`; // tslint:disable-line no-unsafe-any

  const embed = new MessageEmbed()
    .setURL(safeURL)
    .setAuthor('Wikipedia', 'https://i.imgur.com/Z4t6fPM.png')
    .setTitle((page as any).raw.title) // tslint:disable-line no-unsafe-any
    .setThumbnail(mainImage)
    .setDescription(summary)
    .setTimestamp(new Date((page as any).raw.touched)); // tslint:disable-line no-unsafe-any

  return message.channel.send(embed);
};

/**
 * Search an Wikipedia article
 * @param message Message recieved
 * @param next The next middleware
 */
export const searchWiki: Middleware = (message, _context, next) =>
  new Parser(message)
    .filter(startsWith('/wiki'))
    .filterNot(fromBot)
    .positional('query', {
      type: 'string',
      required: true,
    })
    .option('host', {
      type: 'string',
      alias: ['h'],
      default: 'ja.wikipedia.org',
    })
    .handle(async ({ query = '!', host = '!' }) => {
      await wikipediaHandler({ query, host, message });
    })
    .catch(() => {
      next();
    });

/**
 * Search an Wikipedia article
 * @param message Message recieved
 * @param next The next middleware
 */
export const interactiveWiki: Middleware = (message, _, next) =>
  new Parser(message)
    .capture('query', {
      type: 'string',
      regexp: /(.+?)\s?とは$/,
    })
    .handle(({ query }) => {
      if (!query) {
        next();
        return;
      }

      return wikipediaHandler({
        query: query,
        host: 'ja.wikipedia.org',
        message,
      });
    })
    .catch(() => {
      next();
    });
