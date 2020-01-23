import Discord, { Message, VoiceState } from 'discord.js';
import { fromEvent } from 'rxjs';
import { config } from './config';
import { evaluateExpr } from './consumers/evaluate';
import { forward } from './consumers/forward';
import { ping } from './consumers/ping';
import { quote } from './consumers/quote';
import {
  joinVoiceChat,
  leaveVoiceChat,
  safeDisconnect,
  speakVoiceChat,
} from './consumers/voice-chat';
import { interactiveWiki, searchWiki } from './consumers/wiki';
import { VoiceText } from './utils/voice-text';
// import { haiku } from './consumers/haiku';

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

  /** Connection observable */
  public voiceStateUpdate$ = fromEvent<[VoiceState, VoiceState]>(
    this.client,
    'voiceStateUpdate',
  );

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

  public before = (message: Message) => {
    // tslint:disable-next-line no-floating-promises
    message.channel.startTyping();
  };

  public after = (message: Message) => {
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
      interactiveWiki,
      searchWiki,
      quote,
      forward,
      safeDisconnect,
      // haiku,
    ].forEach(consumer => {
      consumer(this);
    });
  };
}
