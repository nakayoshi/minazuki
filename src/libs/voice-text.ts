import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import querystring from 'querystring';
import tmp from 'tmp';

/**
 * Voicetext api wrapper
 */
export class VoiceText {
  protected url = 'https://api.voicetext.jp/v1';
  protected speaker = 'haruka';

  constructor(protected token: string) {}

  /**
   * Fetching audio data from VoiceText API
   * @param text Text to speak
   * @return Path to aduio file or False
   */
  public speak = async (text: string): Promise<string> => {
    const { name: tmpFile } = tmp.fileSync();
    const formattedToken = Buffer.from(`${this.token}:`).toString('base64');

    const response = await fetch(`${this.url}/tts`, {
      method: 'POST',

      headers: {
        Authorization: `Basic ${formattedToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },

      body: querystring.stringify({
        text,
        speaker: this.speaker,
      }),
    });

    if (!response.ok) {
      throw new Error('Fetching WAV failed');
    }

    // tslint:disable-next-line non-literal-fs-path
    await fs.writeFile(tmpFile, await response.buffer());

    return tmpFile;
  };
}
