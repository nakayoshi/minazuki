import Discord from 'discord.js';
import { Minazuki } from '../minazuki';

export type Middleware = (
  message: Discord.Message,
  context: Minazuki,
  next: (...args: any[]) => void,
) => void;

export type MiddlewareCaller = (
  message: Discord.Message,
) => ReturnType<Middleware>;

/**
 * Middleware
 */
export class MiddlewareManager {
  protected readonly context: Minazuki;
  protected readonly middlewareCallers: MiddlewareCaller[] = [];

  constructor(context: Minazuki) {
    this.context = context;
  }

  /**
   * Call the next middleware of specified index
   * @param index Current index
   * @param message Message which recieved
   */
  protected findNextMiddlewareCaller(index: number) {
    if (index + 1 < this.middlewareCallers.length) {
      return this.middlewareCallers[index + 1];
    }

    return;
  }

  /**
   * Append middleware
   * @param middleware Function to append as middleware
   */
  public use(middleware: Middleware): this {
    const index = this.middlewareCallers.length;

    const middlewareCaller = (message: Discord.Message) => {
      middleware(message, this.context, () => {
        const nextCaller = this.findNextMiddlewareCaller(index);

        if (nextCaller) {
          nextCaller(message);
        }
      });

      return;
    };

    this.middlewareCallers.push(middlewareCaller);

    return this;
  }

  /**
   * Start chain responsibility
   * @param message Message which recieved
   */
  public handle(message: Discord.Message): this {
    this.middlewareCallers[0](message);

    return this;
  }
}
