import * as Discord from 'discord.js';
import config from './config';
import middleware from './middlewares';

if ( !config.discordToken || !config.discordToken) {
  process.exit(1);
}

export default class MinazukiBot {
  protected client = new Discord.Client();

  constructor () {
    this.client.login(config.discordToken);
    this.client.on('ready', this.onReady);
    this.client.on('message', this.onMessage);
  }

  protected onReady = () => {
    console.log(`Logged in as ${this.client.user.tag}!`);
  }

  protected onMessage = (message: Discord.Message) => {
    middleware.run(message);
  }
}
