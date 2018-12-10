import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
});

export const config = {
  /** Token for Discord */
  discordToken: process.env.DISCORD_TOKEN as string,

  /** Token for VoiceText */
  voiceTextToken: process.env.VOICETEXT_TOKEN as string,

  /** Token for Twitter */
  twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY as string,
  twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET as string,
  twitterAccessToken: process.env.TWITTER_ACCESS_TOKEN as string,
  twitterAccessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
};
