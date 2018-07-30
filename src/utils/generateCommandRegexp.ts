import MinazukiBot from '../main';

export default function generateCommandRegexp (string: string): RegExp {
  return RegExp(`^${MinazukiBot.prefix}\\s?${string}`);
}
