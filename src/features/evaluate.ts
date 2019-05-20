import vm from 'vm';
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

    if (expr.includes('Promise')) {
      return message.reply('Promiseは利用できません');
    }

    let returnValue: any;
    let thrown = false;

    try {
      returnValue = vm.runInNewContext(expr, undefined, {
        displayErrors: false,
        timeout: 1000,
      });
    } catch (error) {
      returnValue = error;
      thrown = true;
    }

    message.reply(
      '評価結果:\n' +
        '```\n' +
        (thrown ? returnValue.toString() : JSON.stringify(returnValue)) +
        '\n```',
    );
  } else {
    return next();
  }
};
