import fetch from 'node-fetch';
import * as fs from 'fs/promises';
import * as tmp from 'tmp';
import * as queryString from 'query-string';

const VOICETEXT_URL     = 'https://api.voicetext.jp/v1';
const VOICETEXT_SPEAKER = 'haruka';

export class Voicetext {

  token: string = '';

  constructor(token: string) {
    this.token = token;
  }

  public async getVoicetextAudio (text: string) {
    if ( !process.env.VOICETEXT_TOKEN ) {
      process.exit(1);
    }

    const { name: tmpFile } = tmp.fileSync();
    const formattedToken = Buffer.from(`${this.token}:`).toString('base64');

    const data = queryString.stringify({
      text,
      speaker: VOICETEXT_SPEAKER,
    })

    const response = await fetch(`${VOICETEXT_URL}/tts`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${formattedToken}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: data,
    });

    if (!response.ok) {
      throw 'Fetching WAV failed';
    }

    await fs.writeFile(tmpFile, await response.buffer());

    return tmpFile;
  }
}
