import { config } from './config';
import { Minazuki } from './minazuki';

function main() {
  if (!config.discordToken || !config.voiceTextToken) {
    throw Error('API token is not specified. Open `.env` file to modify it');
  }

  return new Minazuki();
}

main();
