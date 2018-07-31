import * as Discord from 'discord.js';
import findHaiku from '../utils/findHaiku';

export async function haiku (message: Discord.Message, next: () => void) {
  const haikuClauses = await findHaiku(message.content, [5, 7, 5]);

  if (haikuClauses) {
    message.reply(`Haiku recgonized!!\n  ${haikuClauses[0]}\n  ${haikuClauses[1]}\n  ${haikuClauses[2]}`);
  } else {
    next();
  }
}
