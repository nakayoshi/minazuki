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
    return message.channel.send(codeblockfy(JSON.stringify(returnValue)));
  }

  try {
    const errorMessage = probablySafeEval('error.toString()', {
      error: thrownError,
    }) as string;

    return message.channel.send(codeblockfy(errorMessage));
  } catch {
    return message.channel.send(
      'エラーが発生し、Error.prototype.toString関数の実行に失敗しました。',
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
