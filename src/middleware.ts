import * as Discord from 'discord.js';

export type MiddelwareType = (message: Discord.Message, next: (...args: any[]) => any) => any;
export type WrappedMiddlewareType = (message: Discord.Message) => MiddelwareType;

export class Middleware {
  protected middlewares: WrappedMiddlewareType[] = [];

  /**
   * Append middleware
   * @param middleware Function to append as middleware
   */
  public use (middleware: MiddelwareType) {
    const index = this.middlewares.length;

    const wrappedMiddleware = (message: Discord.Message) => {
      return middleware(message, () => this.next(index, message));
    };

    this.middlewares = this.middlewares.concat(wrappedMiddleware);
  }

  /**
   * Call the next middleware of specified index
   * @param index Current index
   * @param message Message which recieved
   */
  protected next (index: number, message: Discord.Message) {
    if (index + 1 < this.middlewares.length) {
      this.middlewares[index + 1](message);
      return;
    }
  }

  /**
   * Start chain responsibility
   * @param message Message which recieved
   */
  public handle (message: Discord.Message): void {
    this.middlewares[0](message);
  }
}
