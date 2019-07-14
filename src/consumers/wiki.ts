import { Message, MessageEmbed } from 'discord.js';
import { isLeft } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { filter } from 'rxjs/operators';
import { oc } from 'ts-optchain';
import WikiJS from 'wikijs';
import yargsParser from 'yargs-parser';
import { Consumer } from '.';

interface WikipediaHandlerParams {
  message: Message;
  query: string;
  host?: string;
}

const wikipediaHandler = async (params: WikipediaHandlerParams) => {
  const { message, query, host = 'ja.wikipedia.org' } = params;

  const wikijs = WikiJS({
    apiUrl: `https://${host}/w/api.php`,
  });

  const { results } = await wikijs.search(query);

  if (!results.length) {
    return message.reply('該当の記事は見つかりませんでした。');
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

const SearchWikiProps = t.type({
  _: t.tuple([t.literal('/wiki'), t.string]),
  host: t.union([t.string, t.undefined]),
});

export const searchWiki: Consumer = context =>
  context.message$
    .pipe(
      filter(
        message => !message.author.bot && message.content.startsWith('/wiki'),
      ),
    )
    .subscribe(async message => {
      const args = SearchWikiProps.decode(yargsParser(message.content));
      if (isLeft(args)) return;

      const [, query] = args.right._;
      const { host } = args.right;

      await wikipediaHandler({ query, host, message });
    });

export const interactiveWiki: Consumer = context =>
  context.message$
    .pipe(filter(message => !message.author.bot))
    .subscribe(async message => {
      const match = /^(?<query>.+?)\s?とは$/.exec(message.content);
      if (!match) return;

      const query = oc(match.groups).query();
      if (!query) return;

      return wikipediaHandler({
        query: query,
        host: 'ja.wikipedia.org',
        message,
      });
    });
