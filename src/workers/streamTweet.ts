import * as Twit from 'twit';
import { config } from '../config';
import minazuki from '../main';

export const streamTweet = async () => {
  if (!minazuki.client) {
    return;
  }

  const twitter = new Twit({
    consumer_key:        config.twitterConsumerKey,
    consumer_secret:     config.twitterConsumerSecret,
    access_token:        config.twitterAccessToken,
    access_token_secret: config.twitterAccessTokenSecret,
  });

  const 宗谷いちかさんのTwitterのID = '995253301472972801';
  const NeetshinのDiscordのID     = '356785875008618497';

  const stream = twitter.stream('statuses/filter', { follow: 宗谷いちかさんのTwitterのID });

  stream.on('tweet', (e: Twit.Twitter.Status) => {
    const targetUser = minazuki.client.users.get(NeetshinのDiscordのID);

    if (targetUser) {
      targetUser.send(`**${e.user.screen_name}**\n`
                    + `${e.full_text || e.text}\n`
                    + `*${e.created_at}*\n`
                    + '───────────');
    }
  });

};
