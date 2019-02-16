import { Wikipedia } from '../Wikipedia';

describe('Wikipedia', () => {
  it('searches an article of wikipedia with specific keyword', async () => {
    const wikipedia = new Wikipedia();
    const query = 'Discord (ソフトウェア)';

    // The serach result is mutable...
    const result = await wikipedia.search(query);

    expect(result).not.toBeFalsy();
  });
});
