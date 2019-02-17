import * as Discord from 'discord.js';
import { config } from './config';
import { haiku, tanka } from './features/haiku';
import { controlVoiceConnections, voiceChat } from './features/voiceChat';
import { wikipedia, wikipediaFuzzyKeyword } from './features/wikipedia';
import { MiddlewareManager } from './libs/MiddlwareManager';

export class Minazuki {
  private middlewares = new MiddlewareManager(this);
  public client = new Discord.Client();

  constructor() {
    this.client.login(config.discordToken);

    this.client.on('ready', this.onReady);
    this.client.on('message', this.onMessage);

    this.middlewares.use(wikipedia);
    this.middlewares.use(wikipediaFuzzyKeyword);
    this.middlewares.use(controlVoiceConnections);
    this.middlewares.use(voiceChat);
    this.middlewares.use(tanka);
    this.middlewares.use(haiku);
  }

  protected onReady = () => {
    if (this.client.user) {
      // tslint:disable-next-line no-console
      console.log(`Logged in as ${this.client.user.tag}!`);
    }
  };

  protected onMessage = (message: Discord.Message) => {
    this.middlewares.handle(message);
  };
}
