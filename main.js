require('dotenv').config();
const Discord = require('discord.js');
const wikijs  = require('wikijs').default;

const client = new Discord.Client();
const wiki   = wikijs({apiUrl: 'https://ja.wikipedia.org/w/api.php'});

if ( !process.env.ACCESS_TOKEN ) {
  process.exit(1);
}

client.login(process.env.ACCESS_TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {
  const { author, content } = message;

  if ( author.bot ) {
    return;
  }

  if (/^\/wiki/.test(content)) {
    const [, query] = content.match(/^\/wiki\s(.+?)$/);

    if ( !query ) {
      message.reply('キーワードを指定してくだせー');
    }

    const response = await searchWikipedia(query);
    await message.reply(response);

  } else if (/^(.+?)(って(何(ですか)*|な(あ|ぁ)*に|なん(ですか)*)|とは)[\?\？]*$/.test(content)) {
    const [, query] = content.match(/^(.+?)(って(何(ですか)*|な(あ|ぁ)*に|なん(ですか)*)|とは)[\?\？]*$/);
    const response = await searchWikipedia(query);
    await message.reply(response);
  }
});

async function searchWikipedia (keyword) {
  try {
    const page    = await wiki.page(keyword);
    const summary = await page.summary();
    return summary;
  } catch (e) {
    return '記事が見つからなかったです。';
  }
}
