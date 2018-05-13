import dotenv from 'dotenv';
import FormData from 'form-data';
import fetch from 'node-fetch';
import * as fs from 'fs-promise';
import * as tmp from 'tmp';

dotenv.config();

const VOICETEXT_URL     = 'https://api.voicetext.jp/v1';
const VOICETEXT_SPEAKER = 'haruka';

export async function getVoicetextAudio (text: string) {
  if ( !process.env.VOICETEXT_TOKEN ) {
    process.exit(1);
  }

  const { name: tmpFile } = tmp.fileSync();

  const formData       = new FormData();
  const formattedToken = new Buffer(`${process.env.VOICETEXT_TOKEN}:`).toString("base64");

  formData.append('text',    text);
  formData.append('speaker', VOICETEXT_SPEAKER);

  const response = await fetch(`${VOICETEXT_URL}/tts`, {
    headers: { 'Authorization': `Basic: ${formattedToken}:` },
    body: formData,
  });

  if (!response.ok) {
    throw 'Fetching WAV failed';
  }

  await fs.writeFile(tmpFile, await response.buffer());

  return tmpFile;
}
