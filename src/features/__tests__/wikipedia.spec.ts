jest.mock('../../libs/Wikipedia');

import { Message } from 'discord.js';
import { Wikipedia } from '../../libs/Wikipedia';
import { Minazuki } from '../../Minazuki';
import { fuzzySearchWikipedia, searchWikipedia } from '../wikipedia';

describe('wikipedia', () => {
  it('searches for an article on wikipedia', async () => {
    const reply = jest.fn();

    const msg = ({
      reply,
      content: 'wiki keyword',
      author: {
        bot: false,
      },
      mentions: {
        has: jest.fn(() => true),
      },
    } as any) as Message;

    const wikipedia = new Wikipedia();

    const app = ({
      client: {
        user: true,
      },
      wikipedia,
    } as any) as Minazuki;

    const next = jest.fn();

    await searchWikipedia(msg, app, next);

    expect(wikipedia.search).toBeCalledWith('keyword');
    expect(reply).toBeCalled();
    expect(next).not.toBeCalled();
  });

  it("won't search for an aritcle when query isn't specified", async () => {
    const reply = jest.fn();

    const msg = ({
      reply,
      content: 'wiki',
      author: {
        bot: false,
      },
      mentions: {
        has: jest.fn(() => true),
      },
    } as any) as Message;

    const wikipedia = new Wikipedia();

    const app = ({
      client: {
        user: true,
      },
      wikipedia,
    } as any) as Minazuki;

    const next = jest.fn();

    await searchWikipedia(msg, app, next);

    expect(wikipedia.search).not.toBeCalled();
    expect(reply).toBeCalled();
    expect(next).not.toBeCalled();
  });

  it('replies even aricle was not found', async () => {
    const reply = jest.fn();

    const msg = ({
      reply,
      content: 'wiki non existing article',
      author: {
        bot: false,
      },
      mentions: {
        has: jest.fn(() => true),
      },
    } as any) as Message;

    const wikipedia = new Wikipedia();
    (wikipedia.search as any).mockResolvedValue(false);

    const app = ({
      client: {
        user: true,
      },
      wikipedia,
    } as any) as Minazuki;

    const next = jest.fn();

    await searchWikipedia(msg, app, next);

    expect(wikipedia.search).toBeCalledWith('non existing article');
    expect(reply).toBeCalled();
    expect(next).not.toBeCalled();
  });

  it('searches an article with query with とは', async () => {
    const reply = jest.fn();

    const msg = ({
      reply,
      content: 'keywordとは',
      author: {
        bot: false,
      },
      mentions: {
        has: jest.fn(() => true),
      },
    } as any) as Message;

    const wikipedia = new Wikipedia();

    const app = ({
      client: {
        user: true,
      },
      wikipedia,
    } as any) as Minazuki;

    const next = jest.fn();

    await fuzzySearchWikipedia(msg, app, next);

    expect(wikipedia.search).toBeCalledWith('keyword');
    expect(reply).toBeCalled();
    expect(next).not.toBeCalled();
  });
});
