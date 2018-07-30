import * as Discord from 'discord.js';

export type QueueType = (message: Discord.Message, next: () => void) => void;

export class Middleware {

  /** Array of middlewares */
  protected queue: QueueType[] = [];

  /**
   * Generate Iterable from `this.queue`
   * @param message Message which revieced
   * @yield Result of the middleware
   */
  protected *generator (message: Discord.Message) {
    while (true) {
      const { current, next } = this.makeContext(message);

      yield () => current(message, next);

      if (!next) { break; }
    }
  }

  /**
   * Make a group of wrapped function of
   * current and next task from queue
   * @param message Message which recieved
   */
  protected makeContext (message: Discord.Message) {
    const current = this.queue[0];
    const next    = this.queue[1];

    const wrappedNext = () => {
      next(message, this.makeContext(message).next);
    };

    this.queue.shift();

    return { current, next: wrappedNext };
  }

  /**
   * Appending a new middleware to the queue
   * @param middleware Function processes message
   */
  public append (...middlewares: QueueType[]): void {
    this.queue.push.apply(middlewares);
  }

  /**
   * Excute the first middleware of queue and deliver message
   * like reducer of Redux
   * @param message Message which recieved
   */
  public run (message: Discord.Message): void {
    const sequence = this.generator(message);
    const { value: next } = sequence.next();

    next();
  }
}

export default new Middleware();
