import * as Discord from 'discord.js';
import { MiddlewareManager } from 'src/libs/MiddlwareManager';
import { config } from './config';
import { haiku, tanka } from './features/haiku';
import { controlVoiceConnections, voiceChat } from './features/voiceChat';
import { wikipedia, wikipediaFuzzyKeyword } from './features/wikipedia';

export class Minazuki {
  private middlewares = new MiddlewareManager(this);
  public client = new Discord.Client();

  constructor() {
    this.client.login(config.discordToken);

    this.client.on('ready', this.onReady);
    this.client.on('message', this.onMessage);

    this.middlewares.use(wikipedia, 0);
    this.middlewares.use(wikipediaFuzzyKeyword, 0);
    this.middlewares.use(controlVoiceConnections, 0);
    this.middlewares.use(voiceChat, 0);
    this.middlewares.use(tanka, 1);
    this.middlewares.use(haiku, 1);
  }

  protected onReady = () => {
    // tslint:disable-next-line no-console
    console.log(`Logged in as ${this.client.user.tag}!`);
  };

  protected onMessage = (message: Discord.Message) => {
    this.middlewares.handle(message);
  };
}
