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

  console.log(`${author.username}: ${content}`);

  if (/^\/wiki\s(.+?)$/.test(content)) {
    const [, query] = content.match(/^\/wiki\s(.+?)$/);

    const page    = await wiki.page(query);
    const summary = await page.summary();

    await message.reply(summary);
  }
});
