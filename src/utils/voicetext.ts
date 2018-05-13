import fetch from 'node-fetch';
import * as FormData from 'form-data';
import * as fs from 'fs-promise';
import * as tmp from 'tmp';

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

    const formData       = new FormData();
    const formattedToken = new Buffer(`${this.token}:`).toString("base64");

    formData.append('text',    text);
    formData.append('speaker', VOICETEXT_SPEAKER);

    const response = await fetch(`${VOICETEXT_URL}/tts`, {
      method: 'POST',
      headers: { 'Authorization': `Basic: ${formattedToken}:` },
      body: formData,
    });

    if (!response.ok) {
      console.log(await response.json());
      throw 'Fetching WAV failed';
    }

    await fs.writeFile(tmpFile, await response.buffer());

    return tmpFile;
  }
}
