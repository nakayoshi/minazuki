import fetch from 'node-fetch';
import { Minazuki } from '../../minazuki';
import { TravisCI } from '../travis-ci';

jest.mock('node-fetch', () => ({
  default: jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue('foo'),
  }),
}));

jest.mock('../../config', () => ({
  config: {
    travisCIToken: 'test',
  },
}));

describe('Travis', () => {
  let travisCI!: TravisCI;

  beforeEach(() => {
    travisCI = new TravisCI(({} as any) as Minazuki);
  });

  it("fetches master branch's build status", async () => {
    await travisCI.fetchMasterBranch();

    expect(fetch).toBeCalledWith(
      'https://api.travis-ci.com/repo/5566063/branch/master',
      {
        headers: {
          'Travis-API-Version': '3',
          Authorization: 'test',
        },
      },
    );
  });
});
