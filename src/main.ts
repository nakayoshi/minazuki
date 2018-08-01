import * as Discord from 'discord.js';
import config from './config';
import { haiku } from './features/haiku';
import { controlVoiceConnections, voiceChat } from './features/voiceChat';
import { wikipedia } from './features/wikipedia';
import Middleware from './middleware';


if ( !config.discordToken || !config.discordToken) {
  process.exit(1);
}

class MinazukiBot {
  /** Prefix for commands */
  public prefix: string = '';

  /** Instance of the client */
  protected client = new Discord.Client();
  protected middleware = new Middleware();

  constructor () {
    this.client.login(config.discordToken);

    this.client.on('ready', this.onReady);
    this.client.on('message', this.onMessage);

    this.middleware.use(wikipedia);
    this.middleware.use(controlVoiceConnections);
    this.middleware.use(voiceChat);
    this.middleware.use(haiku);
  }

  protected onReady = () => {
    console.log(`Logged in as ${this.client.user.tag}!`);
    this.prefix = `<@${this.client.user.id}>`;
  }

  protected onMessage = (message: Discord.Message) => {
    this.middleware.handle(message);
  }
}

export default new MinazukiBot();
