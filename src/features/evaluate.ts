import { Message } from 'discord.js';
import vm from 'vm';
import { Middleware } from '../libs/middleware-manager';
import { fromBot, Parser, startsWith } from '../utils/parser';

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
    if (error instanceof Error) {
      thrownError = error;
    }
  }

  return message.channel.send(
    '```\n' +
      (!!thrownError ? thrownError.toString() : JSON.stringify(returnValue)) +
      '\n```',
  );
};

export const evaluateExpr: Middleware = (message, _context, next) =>
  new Parser(message)
    .filterNot(fromBot)
    .filter(startsWith('/eval'))
    .positional('expr', { type: 'string' })
    .handle(({ expr }) => {
      const matches = /```!(js|javascript)+\n(?<codeblock>(.|\n)+?)```/.exec(
        message.content,
      );

      if (matches && matches.groups && matches.groups.codeblock) {
        return handleCode(matches.groups.codeblock, message);
      }

      if (!expr) {
        next();
        return;
      }

      return handleCode(expr, message);
    })
    .catch(() => {
      next();
    });
