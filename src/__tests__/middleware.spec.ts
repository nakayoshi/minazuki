import * as Discrod from 'discord.js';
import Middleware from '../middleware';

describe('Middleware', () => {
  it ('appends a middlewares to the list and kick them', () => {
    const middleware = new Middleware();
    const middleware1 = jest.fn();
    const message = { content: 'dummy message' } as Discrod.Message;

    middleware.use(middleware1);
    middleware.handle(message);

    expect(middleware1).toBeCalled();
  });
});
