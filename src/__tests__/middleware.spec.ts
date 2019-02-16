import * as Discrod from 'discord.js';
import { MiddlewareManager } from 'src/libs/MiddlwareManager';
import { Minazuki } from 'src/Minazuki';

describe('Middleware', () => {
  it('appends a middlewares to the list and kick them', () => {
    const middleware = new MiddlewareManager(({} as any) as Minazuki);
    const middleware1 = jest.fn();
    const message = ({ content: 'dummy message' } as any) as Discrod.Message;

    middleware.use(middleware1);
    middleware.handle(message);

    expect(middleware1).toBeCalled();
  });
});
