import { Consumer } from '.';
import { filterStartsWith } from '../operators';

export const ping: Consumer = context =>
  context.message$.pipe(filterStartsWith('/ping')).subscribe(async message => {
    await message.reply('pong');
  });
