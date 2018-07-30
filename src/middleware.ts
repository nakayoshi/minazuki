import * as Discord from 'discord.js';

export type QueueType = (message: Discord.Message, next: () => void) => void;

export class Middleware {

  /** Array of middlewares */
  protected queue: QueueType[] = [];

  /**
   * Generate array of middleware from `this.queue`
   * @param message Message which revieced
   * @yield Result of the middleware
   */
  protected generator (message: Discord.Message): (() => void)[] {
    // Get current and next middleware from queue
    // And wrap the next recursiviely
    const makeNext = (prevIndex: number): () => void => {
      const currentIndex = prevIndex + 1;
      const current      = this.queue[currentIndex];
      const nextIndex    = currentIndex + 1;
      const next         = this.queue[nextIndex];

      if (this.queue.length < currentIndex + 1) {
        return () => {/* End of the queue*/};
      }

      return () => current(message, () => next(message, makeNext(nextIndex)));
    };

    return this.queue.map((current, index) => () => {
      current(message, makeNext(index));
    });
  }

  /**
   * Appending a new middleware to the queue
   * @param middlewares Function processes message
   */
  public append (...middlewares: QueueType[]): void {
    this.queue.push(...middlewares);
  }

  /**
   * Excute the first middleware of queue
   * @param message Message which recieved
   */
  public run (message: Discord.Message): void {
    const sequence = this.generator(message);
    const next     = sequence[0];
    next();
  }
}

export default new Middleware();
