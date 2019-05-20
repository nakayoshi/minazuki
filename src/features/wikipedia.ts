// tslint:disable prefer-template
import { Middleware } from '../libs/middleware-manager';

/**
 * Search an Wikipedia article
 * @param message Message recieved
 * @param next The next middleware
 */
export const searchWikipedia: Middleware = async (message, app, next) => {
  const { wikipedia } = app;
  const { content, author } = message;

  if (
    author.bot ||
    !app.client.user ||
    !message.mentions.has(app.client.user)
  ) {
    return next();
  }

  if (/wiki/.test(content)) {
    const result = content.match(/wiki\s?(.+?)$/);

    if (!result || !result[1]) {
      return message.reply('キーワードを指定してくだせー');
    }

    const query = result[1];
    const page = await wikipedia.search(query);

    if (!page) {
      return message.reply('記事が見つからなかったです。');
    }

    let summary = await page.summary();
    summary = summary.replace(/\n/g, ' ');
    summary = `${summary.substr(0, 200)}...`;

    message.reply(
      summary + `\nhttps://ja.wikipedia.org/wiki?curid=${page.raw.pageid}`,
    );
  } else {
    return next();
  }
};

/**
 * Search an Wikipedia article
 * @param message Message recieved
 * @param next The next middleware
 */
export const fuzzySearchWikipedia: Middleware = async (message, app, next) => {
  const { wikipedia } = app;
  const { content, author } = message;

  if (author.bot) {
    return next();
  }

  const result = content.match(/(.+?)\s?とは$/);

  if (!result || !result[1]) {
    return next();
  }

  const query = result[1];
  const page = await wikipedia.search(query);

  if (!page) {
    return message.reply('記事が見つからなかったです。');
  }

  let summary = await page.summary();
  summary = summary.replace(/\n/g, ' ');
  summary = `${summary.substr(0, 200)}...`;

  message.reply(
    summary + `\nhttps://ja.wikipedia.org/wiki?curid=${page.raw.pageid}`,
  );
};
