import * as Discord from 'discord.js';
import { Minazuki } from 'src/Minazuki';

export type Middleware = (
  message: Discord.Message,
  app: Minazuki,
  next: (...args: any[]) => any,
) => any;

export type WrappedMiddleware = (message: Discord.Message) => Middleware;

export interface MiddlewareConfig {
  handler: WrappedMiddleware;
  priority: number;
}

export class MiddlewareManager {
  protected middlewares: MiddlewareConfig[] = [];
  protected minazuki: Minazuki;

  constructor(minazuki: Minazuki) {
    this.minazuki = minazuki;
  }

  private appendMiddleware(middlware: MiddlewareConfig) {
    this.middlewares.push(middlware);

    this.middlewares.sort((a, b) => {
      if (a.priority > b.priority) {
        return 0;
      }

      return 1;
    });
  }

  /**
   * Append middleware
   * @param middleware Function to append as middleware
   */
  public use(middleware: Middleware, priority = 0) {
    const index = this.middlewares.length;

    const wrappedMiddleware = (message: Discord.Message) => {
      return middleware(message, this.minazuki, () =>
        this.next(index, message),
      );
    };

    this.appendMiddleware({
      handler: wrappedMiddleware,
      priority,
    });
  }

  /**
   * Call the next middleware of specified index
   * @param index Current index
   * @param message Message which recieved
   */
  protected next(index: number, message: Discord.Message) {
    if (index + 1 < this.middlewares.length) {
      this.middlewares[index + 1].handler(message);

      return;
    }
  }

  /**
   * Start chain responsibility
   * @param message Message which recieved
   */
  public handle(message: Discord.Message): void {
    this.middlewares[0].handler(message);
  }
}
