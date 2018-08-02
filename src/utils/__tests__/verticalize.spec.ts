import verticalize from '../verticalize';

describe('verticalize', () => {
  it ('verticalizes text', () => {
    const text = `
      Discord（ディスコード）とは、Windows、macOS、Android、iOS、Linux、Webブラウザで動作する、
      ゲーマー向けの音声通話・VoIPフリーソフトウェア。
      2018年5月16日時点で、ユーザー数が1億3千万人を上回っている。
    `;

    const result = verticalize(text);

    expect(result).toMatchSnapshot();
  });
});
