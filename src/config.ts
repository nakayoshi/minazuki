import * as dotenv from 'dotenv';
import * as path from 'path';

const dotenvFile = process.env.NODE_ENV === 'production'
  ? '.env'
  : '.env.example';

dotenv.config({
  path: path.resolve(__dirname, '..', dotenvFile),
});

export default {
  /** Token for Discord */
  discordToken: process.env.DISCORD_TOKEN as string,

  /** Token for VoiceText */
  voiceTextToken: process.env.VOICETEXT_TOKEN as string,
};
