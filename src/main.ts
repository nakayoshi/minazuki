import dotenv from 'dotenv';
import Discord from 'discord.js';
import {
  searchWikipedia,
  getVoicetextAudio,
} from './utils';

dotenv.config();

const client = new Discord.Client();
let vc: Discord.VoiceConnection;

if ( !process.env.DISCORD_TOKEN ) {
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message: Discord.Message) => {
  const { author, content, member } = message;

  if ( author.bot ) {
    return;
  }

  if ( vc !== undefined ) {
    vc.playFile(await getVoicetextAudio(content));
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
    vc = await member.voiceChannel.join();
    await message.reply('ボイスチャットから退出しました');
  }
});

