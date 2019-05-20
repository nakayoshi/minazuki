import * as Discord from 'discord.js';
import { Minazuki } from '../minazuki';

export type Middleware = (
  message: Discord.Message,
  app: Minazuki,
  next: (...args: any[]) => any,
) => any;

export type WrappedMiddleware = (message: Discord.Message) => Middleware;

export class MiddlewareManager {
  protected middlewares: WrappedMiddleware[] = [];
  protected minazuki: Minazuki;

  constructor(minazuki: Minazuki) {
    this.minazuki = minazuki;
  }

  /**
   * Append middleware
   * @param middleware Function to append as middleware
   */
  public use(middleware: Middleware) {
    const index = this.middlewares.length;

    const wrappedMiddleware = (message: Discord.Message) =>
      middleware(message, this.minazuki, () => this.next(index, message));

    this.middlewares.push(wrappedMiddleware);
  }

  /**
   * Call the next middleware of specified index
   * @param index Current index
   * @param message Message which recieved
   */
  protected next(index: number, message: Discord.Message) {
    if (index + 1 < this.middlewares.length) {
      this.middlewares[index + 1](message);

      return;
    }
  }

  /**
   * Start chain responsibility
   * @param message Message which recieved
   */
  public handle(message: Discord.Message): void {
    this.middlewares[0](message);
  }
}
