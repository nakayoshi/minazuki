import * as Discrod from 'discord.js';
import { Minazuki } from '../../minazuki';
import { MiddlewareManager } from '../middleware-manager';

describe('Middleware', () => {
  it('appends a middlewares to the list and kick them', () => {
    const middlewares = new MiddlewareManager(({} as any) as Minazuki);
    const middleware1 = jest.fn((_, __, next) => next());
    const middleware2 = jest.fn((_, __, next) => next());
    const middleware3 = jest.fn((_, __, next) => next());
    const message = ({ content: 'dummy message' } as any) as Discrod.Message;

    middlewares.use(middleware1);
    middlewares.use(middleware2);
    middlewares.use(middleware3);

    middlewares.handle(message);

    expect(middleware1).toBeCalled();
    expect(middleware2).toBeCalled();
    expect(middleware3).toBeCalled();
  });

  it("won't call rest of functions if any of the middlewares weren't be called", () => {
    const middlewares = new MiddlewareManager(({} as any) as Minazuki);
    const middleware1 = jest.fn((_, __, next) => next());
    const middleware2 = jest.fn((_, __, ___) => {
      /* noop */
    });
    const middleware3 = jest.fn((_, __, next) => next());
    const message = ({ content: 'dummy message' } as any) as Discrod.Message;

    middlewares.use(middleware1);
    middlewares.use(middleware2);
    middlewares.use(middleware3);

    middlewares.handle(message);

    expect(middleware1).toBeCalled();
    expect(middleware2).toBeCalled();
    expect(middleware3).not.toBeCalled();
  });
});
