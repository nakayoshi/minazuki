import { Message } from 'discord.js';

export const startsWith = (prefix: string) => (message: Message) => {
  return message.content.startsWith(prefix);
};

export function fromBot(message: Message) {
  return message.author.bot;
}

interface ValueProp {
  type: keyof StringifiedTypes;
  default?: any;
  required?: boolean;
}

interface OptionParams extends ValueProp {
  type: keyof StringifiedTypes;
  alias?: string[];
  default?: any;
  required?: boolean;
}

interface CaptureParams extends ValueProp {
  type: keyof StringifiedTypes;
  regexp: RegExp;
  default?: any;
  required?: boolean;
}

interface StringifiedTypes {
  string: string;
  number: number;
}

type Defined<T extends unknown> = T extends undefined ? false : true;

type InferOption<
  T extends OptionParams | CaptureParams
> = (T['required'] extends true
  ? true
  : false & Defined<T['default']>) extends true
  ? StringifiedTypes[T['type']]
  : StringifiedTypes[T['type']] | undefined;

type Options = { [key: string]: any };

/**
 * Parser
 */
export class Parser<T extends Options> {
  public values: Options = {};
  private reason?: Error;
  private readonly tokens: string[];
  private registeredPotision = 1;

  constructor(public readonly message: Message) {
    this.tokens = message.content.split(' ');
  }

  private transformValue<U extends keyof StringifiedTypes>(
    value: unknown,
    type: U,
  ) {
    switch (type) {
      case 'string':
        return `${value}` as StringifiedTypes[U];
      case 'number':
        return Number(value) as StringifiedTypes[U];
      default:
        throw new Error('unsupported value');
    }
  }

  public filter(func: (message: Message) => boolean) {
    if (!func(this.message)) {
      this.reason = new Error('Filter failed');
    }

    return this;
  }

  public filterNot(func: (message: Message) => boolean) {
    return this.filter(message => !func(message));
  }

  /**
   * Collect value by potision of token which is space-separated content
   * @param name Name of value
   * @param params Parameters
   */
  public positional<K extends string, O extends ValueProp>(
    name: K,
    params: O,
  ): Parser<T & { [key in K]: InferOption<O> }> {
    const value = this.tokens[this.registeredPotision];
    this.values[name] = this.transformValue(value, params.type) as T[K];
    this.registeredPotision += 1;

    return this;
  }

  /**
   * Collect value that satisfies `--name=value` style
   * @param name Name of value
   * @param params Parameters
   */
  public option<K extends string, O extends OptionParams>(
    name: K,
    params: O,
  ): Parser<T & { [key in K]: InferOption<O> }> {
    return this.capture(name, {
      regexp: new RegExp(`^--${name}=(.+?)$`),
      ...params,
    });
  }

  public capture<K extends string, O extends CaptureParams>(
    name: K,
    params: O,
  ): Parser<T & { [key in K]: InferOption<O> }> {
    const matches = params.regexp.exec(this.message.content);

    if (params.required && !(matches && matches[1])) {
      this.reason = new Error('regexp not matched');
    }

    this.values[name] =
      matches && matches[1]
        ? this.transformValue(matches[1], params.type)
        : params.default; // tslint:disable-line

    return this;
  }

  public handle(func: (option: T) => void) {
    if (!this.reason) {
      func(this.values as T);
    }

    return this;
  }

  public catch(func: (reason?: Error) => void) {
    func(this.reason);

    return this;
  }
}
