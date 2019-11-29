import { MessageEmbed } from 'discord.js';
import { isLeft } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import WikiJS from 'wikijs';
import yargsParser from 'yargs-parser';
import { Consumer } from '.';
import { filterNotBot, filterStartsWith } from '../operators';

interface WikipediaHandlerParams {
  query: string;
  host?: string;
}

const wikipediaHandler = async (params: WikipediaHandlerParams) => {
  const { query, host = 'ja.wikipedia.org' } = params;
  const wikijs = WikiJS({
    apiUrl: `https://${host}/w/api.php`,
  });

  const { results } = await wikijs.search(query);
  if (!results.length) {
    return;
  }

  const page = await wikijs.page(results[0]);

  const mainImage = await page.mainImage();
  const summary = (await page.summary())
    .replace(/\n/g, ' ')
    .substr(0, 200)
    .concat('...');

  const safeURL = `https://${host}/wiki?curid=${(page as any).raw.pageid}`; // tslint:disable-line no-unsafe-any

  return new MessageEmbed()
    .setURL(safeURL)
    .setAuthor('Wikipedia', 'https://i.imgur.com/Z4t6fPM.png')
    .setTitle((page as any).raw.title) // tslint:disable-line no-unsafe-any
    .setThumbnail(mainImage)
    .setDescription(summary)
    .setTimestamp(new Date((page as any).raw.touched)); // tslint:disable-line no-unsafe-any
};

const SearchWikiProps = t.type({
  _: t.tuple([t.literal('/wiki'), t.string]),
  host: t.union([t.string, t.undefined]),
});

export const searchWiki: Consumer = context =>
  context.message$
    .pipe(filterNotBot, filterStartsWith('/wiki'))
    .subscribe(async message => {
      context.before(message);

      const args = SearchWikiProps.decode(yargsParser(message.content));

      if (isLeft(args)) {
        return context.after(message);
      }

      const [, query] = args.right._;
      const { host } = args.right;

      const embed = await wikipediaHandler({ query, host });

      if (!embed) {
        await message.channel.send('該当の記事は見つかりませんでした。');
        return context.after(message);
      }

      await message.channel.send(embed);
      return context.after(message);
    });

export const interactiveWiki: Consumer = context =>
  context.message$.pipe(filterNotBot).subscribe(async message => {
    const match = /^(?<query>.+?)\s?とは$/.exec(message.content);
    if (!match) return;
    context.before(message);

    const query = match?.groups?.query;

    if (!query) {
      return context.after(message);
    }

    const embed = await wikipediaHandler({
      query: query,
      host: 'ja.wikipedia.org',
    });

    if (!embed) {
      return context.after(message);
    }

    await message.channel.send(embed);
    return context.after(message);
  });
