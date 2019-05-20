// tslint:disable no-import-side-effect mocha-no-side-effect-code no-non-null-assertion
jest.mock('wikijs', () => ({
  default: jest.fn(() => ({
    search: jest.fn().mockResolvedValue({
      results: ['a', 'b', 'c'],
      query: 'query',
      async next() {
        return {};
      },
    }),

    page: jest.fn().mockResolvedValue({
      raw: {
        pageid: 'something nice',
      },
    }),
  })),
}));

import { Wikipedia } from '../wikipedia';

describe('Wikipedia', () => {
  it('searches an article of wikipedia with specific keyword', async () => {
    const wikipedia = new Wikipedia();
    const query = 'Nice article';
    const result = await wikipedia.search(query);
    expect(result!.raw.pageid).toEqual('something nice');
  });
});
