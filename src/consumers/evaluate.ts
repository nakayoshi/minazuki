import { Message } from 'discord.js';
import { filter } from 'rxjs/operators';
import vm from 'vm';
import { Consumer } from '.';

const handleCode = async (expr: string, message: Message) => {
  let returnValue: any;
  let thrownError: Error | undefined;

  try {
    returnValue = vm.runInNewContext(
      expr,
      {
        Promise: undefined,
      },
      {
        displayErrors: false,
        timeout: 1000,
      },
    );
  } catch (error) {
    thrownError = error as Error;
  }

  return message.channel.send(
    '```js\n' +
      (!!thrownError ? thrownError.toString() : JSON.stringify(returnValue)) +
      '\n```',
  );
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

      const matches = /```!(js|javascript)+\n(?<codeblock>(.|\n)+?)```/.exec(
        codelike,
      );

      if (matches && matches.groups && matches.groups.codeblock) {
        return handleCode(matches.groups.codeblock, message);
      }

      return handleCode(codelike, message);
    });
