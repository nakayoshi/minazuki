import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
});

export default {
  /** Token for Discord */
  discordToken: process.env.DISCORD_TOKEN as string,

  /** Token for VoiceText */
  voiceTextToken: process.env.VOICETEXT_TOKEN as string,
};
