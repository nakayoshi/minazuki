import * as Discord from 'discord.js';
import config from './config';
import { haiku } from './features/haiku';
import { controlVoiceConnections, voiceChat } from './features/voiceChat';
import { wikipedia } from './features/wikipedia';
import Middleware from './middleware';


if ( !config.discordToken || !config.discordToken) {
  console.error('Your Discord/VoiceText API token was not specified. Open `.env` file to modify it');
  throw Error('Invalid token');
  process.exit(1);
}

class MinazukiBot {

  constructor () {
    this.client.login(config.discordToken);

    this.client.on('ready', this.onReady);
    this.client.on('message', this.onMessage);

    this.middleware.use(wikipedia);
    this.middleware.use(controlVoiceConnections);
    this.middleware.use(voiceChat);
    this.middleware.use(haiku);
  }

  public client = new Discord.Client();
  public middleware = new Middleware();

  protected onReady = () => {
    console.log(`Logged in as ${this.client.user.tag}!`);
  }

  protected onMessage = (message: Discord.Message) => {
    this.middleware.handle(message);
  }
}

export default new MinazukiBot();
