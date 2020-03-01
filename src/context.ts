import Discord from 'discord.js';
import { fromEvent } from 'rxjs';
import { config } from './config';
import { evaluateExpr } from './consumers/evaluate';
import { highlight } from './consumers/highlight';
import { ping } from './consumers/ping';
import {
  joinVoiceChat,
  leaveVoiceChat,
  safeDisconnect,
  speakVoiceChat,
} from './consumers/voice-chat';
import { interactiveWiki, searchWiki } from './consumers/wiki';
import { VoiceText } from './utils/voice-text';

export interface Raw<T = unknown> {
  t: Discord.WSEventType;
  s: number;
  op: number;
  d: T;
}

/**
 * Context
 */
export class Context {
  public client = new Discord.Client();

  public voiceText = new VoiceText(config.voiceTextToken);

  public message$ = fromEvent<Discord.Message>(this.client, 'message');

  public raw$ = fromEvent<[Raw]>(this.client, 'raw');

  public voiceStateUpdate$ = fromEvent<
    [Discord.VoiceState, Discord.VoiceState]
  >(this.client, 'voiceStateUpdate');

  /**
   * Initialize context
   */
  public static async init() {
    const instance = new Context();
    await instance.client.login(config.discordToken);

    if (!instance.client.user) return;
    // tslint:disable-next-line no-console
    console.log(`Logged in as ${instance.client.user.tag}!`);

    instance.registerConsumers();
  }

  public before = (message: Discord.Message) => {
    // tslint:disable-next-line no-floating-promises
    message.channel.startTyping();
  };

  public after = (message: Discord.Message) => {
    // tslint:disable-next-line no-floating-promises
    message.channel.stopTyping(true);
  };

  /**
   * Activate consumers with instance of this context
   */
  protected registerConsumers = () => {
    [
      evaluateExpr,
      joinVoiceChat,
      leaveVoiceChat,
      speakVoiceChat,
      ping,
      highlight,
      interactiveWiki,
      searchWiki,
      safeDisconnect,
    ].forEach(consumer => {
      consumer(this);
    });
  };
}
