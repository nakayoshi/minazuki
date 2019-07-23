import { Message } from 'discord.js';
import { filter } from 'rxjs/operators';
import vm, { Context, RunningScriptOptions } from 'vm';
import { Consumer } from '.';

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
  let thrownError: Error | undefined;

  try {
    returnValue = probablySafeEval(expr);
  } catch (error) {
    thrownError = error as Error;
  }

  if (!thrownError) {
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
      error: thrownError,
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
    .pipe(
      filter(
        message => !message.author.bot && message.content.startsWith('/eval'),
      ),
    )
    .subscribe(async message => {
      const codelike = message.content.replace(/\/eval\s?/, '');
      if (!codelike) {
        return message.channel.send('評価する式を指定してください。');
      }

      const matches = /```(js|javascript)+\n(?<codeblock>(.|\n)+?)```/.exec(
        codelike,
      );

      if (matches && matches.groups && matches.groups.codeblock) {
        return handleCode(matches.groups.codeblock, message);
      }

      return handleCode(codelike, message);
    });
