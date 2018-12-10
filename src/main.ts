import * as Discord from 'discord.js';
import { config } from './config';
import { haiku, tanka } from './features/haiku';
import { controlVoiceConnections, voiceChat } from './features/voiceChat';
import { wikipedia, wikipediaFizzyKeyword } from './features/wikipedia';
import { Middleware } from './middleware';
import { streamTweet } from './workers/streamTweet';

if ( !config.discordToken || !config.voiceTextToken) {
  throw Error('API token is not specified. Open `.env` file to modify it');
}

class MinazukiBot {

  public client = new Discord.Client();
  public middleware = new Middleware();

  constructor () {
    this.client.login(config.discordToken);

    this.client.on('ready', this.onReady);
    this.client.on('message', this.onMessage);

    this.middleware.use(wikipedia);
    this.middleware.use(wikipediaFizzyKeyword);
    this.middleware.use(controlVoiceConnections);
    this.middleware.use(voiceChat);
    this.middleware.use(tanka);
    this.middleware.use(haiku);
  }

  protected onReady = () => {
    console.log(`Logged in as ${this.client.user.tag}!`);
    streamTweet();
  }

  protected onMessage = (message: Discord.Message) => {
    this.middleware.handle(message);
  }
}

export default new MinazukiBot();
