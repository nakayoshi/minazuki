import * as path from 'path';
import { MatsuoBasho } from 'src/libs/MatsuoBasho';

describe('MatsuoBasho', () => {
  it('finds haiku from given sentence', async () => {
    const dict = path.join(__dirname, '../../../node_modules/kuromoji/dict/');
    const basho = new MatsuoBasho([5, 7, 5], dict);

    const text =
      '日銀の金融政策の一部修正は、アベノミクスの柱となる金融緩和継続を求める首相官邸と歩調を合わせたものだ。';
    const result = await basho.findHaiku(text);

    expect(result).toEqual(['継続を', '求める首相', '官邸と']);
  });

  it('finds tanka from given sentence', async () => {
    const dict = path.join(__dirname, '../../../node_modules/kuromoji/dict/');
    const basho = new MatsuoBasho([5, 7, 5, 7, 7], dict);

    const text =
      'その一方で前述のように縁起物とされ、フクロウの置物も存在する。またことわざの一つに「フクロウの宵鳴き、糊すって待て」というものがある。宵にフクロウが鳴くと明日は晴れるので洗濯物を干せという意味';
    const result = await basho.findHaiku(text);

    expect(result).toEqual([
      'フクロウが',
      '鳴くと明日は',
      '晴れるので',
      '洗濯物を',
      '干せという意味',
    ]);
  });
});
