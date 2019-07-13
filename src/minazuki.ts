import Discord from 'discord.js';
import { config } from './config';
import { evaluateExpr } from './features/evaluate';
import { haiku } from './features/haiku';
import {
  joinVoiceChat,
  leaveVoiceChat,
  speakVoiceChat,
} from './features/voice-chat';
import { interactiveWiki, searchWiki } from './features/wiki';
import { MiddlewareManager } from './libs/middleware-manager';
import { VoiceText } from './libs/voice-text';

/**
 * Context
 */
export class Minazuki {
  private readonly middlewares = new MiddlewareManager(this);
  public client = new Discord.Client();
  public voiceText = new VoiceText(config.voiceTextToken);
  public voiceConnections = new Map<string, Discord.VoiceConnection>();

  public static async init() {
    const _this = new Minazuki();

    await _this.client.login(config.discordToken);
    _this.client.on('ready', _this.handleReady);
    _this.client.on('message', _this.handleMessage);
  }

  protected handleReady = () => {
    if (!this.client.user) return;

    // tslint:disable-next-line no-console
    console.log(`Logged in as ${this.client.user.tag}!`);

    this.middlewares.use(evaluateExpr);
    this.middlewares.use(searchWiki);
    this.middlewares.use(interactiveWiki);
    this.middlewares.use(joinVoiceChat);
    this.middlewares.use(leaveVoiceChat);
    this.middlewares.use(speakVoiceChat);
    this.middlewares.use(haiku);
  };

  protected handleMessage = (message: Discord.Message) => {
    this.middlewares.handle(message);
  };
}
