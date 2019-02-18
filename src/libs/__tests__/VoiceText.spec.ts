// tslint:disable mocha-no-side-effect-code
jest.mock('fs');
jest.mock('node-fetch');

jest.mock('tmp', () => ({
  fileSync: jest.fn(() => ({
    name: 'filename',
  })),
}));

import * as fs from 'fs';
import fetch from 'node-fetch';
import { VoiceText } from '../VoiceText';

describe('VoiceText', () => {
  let voiceText: VoiceText;

  beforeEach(() => {
    voiceText = new VoiceText('token');
  });

  it('fetches audio data and play it on discrod', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      buffer: jest.fn().mockResolvedValue('foo'),
    });

    const res = await voiceText.speak('Hello world');

    expect(res).toEqual('filename');
    expect(fs.writeFileSync).toBeCalledWith('filename', 'foo');
    expect(fetch).toBeCalledWith(
      'https://api.voicetext.jp/v1/tts',
      expect.objectContaining({
        method: 'POST',
        body: 'text=Hello%20world&speaker=haruka',
      }),
    );
  });

  it('throws error when response is not return with !ok', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
    });

    const reqPromise = voiceText.speak('Hello world');

    expect(reqPromise).rejects.toThrowError();
  });
});
