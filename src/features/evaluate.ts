import safeEval from 'safe-eval';
import { Middleware } from '../libs/middleware-manager';

/**
 * Search an Wikipedia article
 * @param message Message recieved
 * @param next The next middleware
 */
export const evaluate: Middleware = async (message, app, next) => {
  const { content, author } = message;

  if (
    author.bot ||
    !app.client.user ||
    !message.mentions.has(app.client.user)
  ) {
    return next();
  }

  if (/eval/.test(content)) {
    const result = content.match(/eval\s?(.+?)$/);

    if (!result || !result[1]) {
      return message.reply('コードを入力して式を評価します');
    }

    const expr = result[1];
    let returnValue: any;

    try {
      returnValue = safeEval(expr);
    } catch (e) {
      returnValue = e;
    }

    message.reply(
      '評価結果:\n' + '```\n' + JSON.stringify(returnValue) + '\n```',
    );
  } else {
    return next();
  }
};
