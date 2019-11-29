import { Message } from 'discord.js';
import vm, { Context, RunningScriptOptions } from 'vm';
import { Consumer } from '.';
import { filterNotBot, filterStartsWith } from '../operators';

const probablySafeEval = (
  expr: string,
  context?: Context,
  options?: RunningScriptOptions,
) => {
  return vm.runInNewContext(
    expr,
    {
      Promise: undefined,
      ...context,
    },
    {
      displayErrors: false,
      timeout: 1000,
      ...options,
    },
  );
};

const codeblockfy = (code: string, language = 'json') => {
  return '```' + language + '\n' + code + '\n```';
};

const handleCode = async (expr: string, message: Message) => {
  let returnValue: any;
  let hasThrownError: Error | undefined;

  try {
    returnValue = probablySafeEval(expr);
  } catch (error) {
    hasThrownError = error as Error;
  }

  if (!hasThrownError) {
    try {
      // When the value is an object, JSON.stringify() just calls Object.toJSON
      // so you must wrap then with the vm to avoid allowing users to execute codes out of the sandbox
      const jsonString = probablySafeEval('JSON.stringify(value)', {
        value: returnValue,
      }) as string;
      const codeblock = codeblockfy(jsonString);

      return message.channel.send(codeblock);
    } catch {
      return message.channel.send(
        '返り値のJSON文字列化に失敗しました。' +
          '循環参照やカスタム `toJSON()` メソッドの実装がないか確認してください',
      );
    }
  }

  try {
    // As well as JSON.stringfiy(), you need to use vm technique here
    const errorMessage = probablySafeEval('error.toString()', {
      error: hasThrownError,
    }) as string;

    // You have to ensure that the return value of `Error.prototype.toString()` is a string.
    // Because when users tried to evaluate expressions that throw an object which contains custom `toString()`,
    // then you will allow users to run the user-specified `toString()` out of the VM through the implicit type conversion.
    if (typeof errorMessage !== 'string') {
      throw Error('Result of error.toString() is not a string');
    }

    const codeblock = codeblockfy(errorMessage);

    return message.channel.send(codeblock);
  } catch {
    return message.channel.send(
      'エラーが発生し、メソッド `Error.prototype.toString()` の実行に失敗しました。',
    );
  }
};

// const Props = t.type({
//   _: t.tuple([t.literal('/eval'), t.string]),
// });

export const evaluateExpr: Consumer = context =>
  context.message$
    .pipe(filterNotBot, filterStartsWith('/eval'))
    .subscribe(async message => {
      context.before(message);

      const code = message.content.replace(/\/eval\s?/, '');
      const codeBlockRegexp = /```(js|javascript)+\n(?<codeblock>(.|\n)+?)```/;

      if (!code) {
        context.after(message);
        return message.channel.send('評価する式を指定してください。');
      }

      const codeBlockMatches = codeBlockRegexp.exec(code);
      const expr = codeBlockMatches?.groups?.codeblock ?? code;

      context.after(message);
      return handleCode(expr, message);
    });
