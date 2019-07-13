import Discord, { Message } from 'discord.js';
import { fromEvent } from 'rxjs';
import { config } from './config';
import { evaluateExpr } from './consumers/evaluate';
import { haiku } from './consumers/haiku';
import { quote } from './consumers/quote';
import {
  joinVoiceChat,
  leaveVoiceChat,
  speakVoiceChat,
} from './consumers/voice-chat';
import { interactiveWiki, searchWiki } from './consumers/wiki';
import { VoiceText } from './utils/voice-text';

/**
 * Context
 */
export class Context {
  /** Discord client */
  public client = new Discord.Client();
  /** VoiceText client */
  public voiceText = new VoiceText(config.voiceTextToken);
  /** Message observable */
  public message$ = fromEvent<Message>(this.client, 'message');

  /**
   * Initialize context
   */
  public static async init() {
    const instance = new Context();
    await instance.client.login(config.discordToken);

    if (!instance.client.user) return;
    // tslint:disable-next-line no-console
    console.log(`Logged in as ${instance.client.user.tag}!`);

    instance.regiserConsumers();
  }

  /**
   * Activate consumers with instance of this context
   */
  protected regiserConsumers = () => {
    [
      evaluateExpr,
      haiku,
      joinVoiceChat,
      leaveVoiceChat,
      speakVoiceChat,
      interactiveWiki,
      searchWiki,
      quote,
    ].forEach(consumer => {
      consumer(this);
    });
  };
}
