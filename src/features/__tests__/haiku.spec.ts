jest.mock('../../libs/matsuo-basho');

import { Message } from 'discord.js';
import { Minazuki } from '../../minazuki';
import { haiku, tanka } from '../haiku';

describe('haiku', () => {
  it('detects haiku', async () => {
    const msg = {
      reply: jest.fn(),
      author: {
        username: 'user',
      },
    };
    const next = jest.fn();

    await haiku((msg as any) as Message, ({} as any) as Minazuki, next);

    expect(next).not.toBeCalled();
    expect(msg.reply).toBeCalled();
  });

  it('calls next it invalid message', async () => {
    const msg = ({
      reply: jest.fn(),
      author: {
        bot: true,
      },
    } as any) as Message;
    const next = jest.fn();

    await haiku(msg, ({} as any) as Minazuki, next);

    expect(msg.reply).not.toBeCalled();
    expect(next).toBeCalled();
  });
});

describe('tanka', () => {
  it('detects tanka', async () => {
    const msg = {
      reply: jest.fn(),
      author: {
        username: 'user',
      },
    };
    const next = jest.fn();

    await tanka((msg as any) as Message, ({} as any) as Minazuki, next);

    expect(next).not.toBeCalled();
    expect(msg.reply).toBeCalled();
  });

  it('calls next it invalid message', async () => {
    const msg = ({
      reply: jest.fn(),
      author: {
        bot: true,
      },
    } as any) as Message;
    const next = jest.fn();

    await tanka(msg, ({} as any) as Minazuki, next);

    expect(msg.reply).not.toBeCalled();
    expect(next).toBeCalled();
  });
});
