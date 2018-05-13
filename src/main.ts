import * as path from 'path';
import * as dotenv from 'dotenv';
import * as Discord from 'discord.js';
import {
  searchWikipedia,
  Voicetext,
} from './utils';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

if ( !process.env.DISCORD_TOKEN || !process.env.VOICETEXT_TOKEN) {
  process.exit(1);
}

const client = new Discord.Client();
const voicetext = new Voicetext(process.env.VOICETEXT_TOKEN as string);
let vc: Discord.VoiceConnection|null;

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message: Discord.Message) => {
  const { author, content, member } = message;

  if ( author.bot ) {
    return;
  }

  if ( vc && content && /^[^\!\?\/]/.test(content) ) {
    let validatedContent: string;
    console.log(content);

    if ( /^<@[0-9]+>\s(.*?)$/.test(content) ) {
      [, validatedContent] = content.match(/^<@[0-9]+>\s(.*?)$/) as string[];
    } else {
      validatedContent = content;
    }

    vc.playFile(await voicetext.getVoicetextAudio(validatedContent));
  }

  /**
   * Searching Wikipedia article
   */
  if (/^\/wiki/.test(content)) {
    const [, query] = content.match(/^\/wiki\s(.+?)$/) as string[];

    if ( !query ) {
      message.reply('キーワードを指定してくだせー');
    }

    const response = await searchWikipedia(query);
    await message.reply(response);

  } else if (/^(.+?)(って(何((で)*すか)*|な(あ|ぁ)*に|なん(なん|なの)*(ですか)*)|とは)[\?\？]*$/.test(content)) {
    const [, query] = content.match(/^(.+?)(って(何((で)*すか)*|な(あ|ぁ)*に|なん(なん|なの)*(ですか)*)|とは)[\?\？]*$/) as string[];
    const response = await searchWikipedia(query);
    await message.reply(response);
  }

  /**
   * Voice chat invitation feature
   */
  if (/^\/join/.test(content) && member.voiceChannel) {
    vc = await member.voiceChannel.join();
    await message.reply('ボイスチャットに参加しました');
  }

  /**
   * Voice chat kicking out feature
   */
  if (/^\/leave/.test(content) && member.voiceChannel) {
    await member.voiceChannel.leave();
    vc = null;
    await message.reply('ボイスチャットから退出しました');
  }
});

