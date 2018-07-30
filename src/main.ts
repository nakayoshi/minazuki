import * as Discord from 'discord.js';
import config from './config';
import './features';
import middleware from './middleware';

if ( !config.discordToken || !config.discordToken) {
  process.exit(1);
}

class MinazukiBot {
  /** Prefix for commands */
  public prefix: string = '';

  /** Instance of the client */
  protected client = new Discord.Client();

  constructor () {
    this.client.login(config.discordToken);
    this.client.on('ready', this.onReady);
    this.client.on('message', this.onMessage);
  }

  protected onReady = () => {
    console.log(`Logged in as ${this.client.user.tag}!`);
    this.prefix = `<@${this.client.user.id}>`;
  }

  protected onMessage = (message: Discord.Message) => {
    if (message.author.bot) {
      return;
    }

    middleware.run(message);
  }
}

export default new MinazukiBot();
