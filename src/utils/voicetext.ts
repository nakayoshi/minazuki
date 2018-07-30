import * as fs from 'fs';
import fetch from 'node-fetch';
import * as queryString from 'query-string';
import * as tmp from 'tmp';

export default class VoiceText {

  protected token   = '';
  protected url     = 'https://api.voicetext.jp/v1';
  protected speaker = 'haruka';

  constructor (token: string) {
    this.token = token;
  }

  /**
   * Fetching audio data from VoiceText API
   * @param text Text to speak
   * @return Path to aduio file or False
   */
  public speak = async (text: string): Promise<string> => {
    if ( !this.token ) {
      console.error(`
        VoiceText: Authentication token is not specified
        See also https://cloud.voicetext.jp/webapi
      `);

      throw new Error('Fetching WAV failed');
    }

    const { name: tmpFile } = tmp.fileSync();
    const formattedToken = Buffer.from(`${this.token}:`).toString('base64');

    const response = await fetch(`${this.url}/tts`, {
      method: 'POST',

      headers: {
        'Authorization': `Basic ${formattedToken}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },

      body: queryString.stringify({
        text,
        speaker: this.speaker,
      }),
    });

    if (!response.ok) {
      throw new Error('Fetching WAV failed');
    }

    await fs.promises.writeFile(tmpFile, await response.buffer());

    return tmpFile;
  }
}
