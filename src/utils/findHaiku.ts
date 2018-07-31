/**
 * Original algorithm author: github.com/mattn 🙏
 * https://github.com/mattn/go-haiku/blob/master/haiku.go
 */
import * as Kuromoji from 'kuromoji';

const ignoreText = /[\[\]「」『』]/g;
const ignoreChar = /[ァィゥェォャュョ]/g;

/**
 * countChars return count of characters with ignoring japanese small letters.
 * @param string String to count
 * @return The result
 */
export function countSyllables (string: string): number {
  return string.replace(ignoreChar, '').length;
}

/**
 * isWord Return true when the kind of the word
 * is possible to be leading of sentence.
 * @param token Token to check
 * @return The result
 */
export function isStartableWith (token: Kuromoji.Token): boolean {
  const posForStart = [
    '名詞', '形容詞', '形容動詞', '副詞', '連体詞',
    '接続詞', '感動詞', '接頭詞', 'フィラー',
  ];

  if (
    posForStart.includes(token.pos) &&
    token.pos_detail_1 !== '非自立' &&
    token.pos_detail_1 !== '接尾'
  ) {
    return true;
  }

  if (token.pos === '動詞' && token.pos_detail_1 !== '接尾') {
    return true;
  }

  if (token.pos === 'カスタム人名' || token.pos === 'カスタム名詞') {
    return true;
  }

  return false;
}

export function isFinishableWith (token: Kuromoji.Token): boolean {
  return token.pos_detail_1 !== '非自立' && !/^連用/.test(token.conjugated_form) && token.conjugated_form !== '未然形';
}

export function isSpace (token: Kuromoji.Token): boolean {
  return token.pos_detail_1 === '空白';
}

export default function findHaiku (text: string, rules: number[] = [5, 7, 5]): Promise<string[]|null> {
  const matches: string[] = [];

  const validatedText  = text
    .replace(ignoreChar, '')
    .replace(ignoreText, '');

  return new Promise((resolve, reject) => {
    Kuromoji.builder({ dicPath: '/Users/nucx/Developments/minazuki-bot-discord/node_modules/kuromoji/dict/' }).build((error, tokenizer) => {
      if (error) {
        reject('findHaiku: Error occured while loading dictionaly');
      }

      const tokens   = tokenizer.tokenize(validatedText);
      const iterable = function* generator (tokens: Kuromoji.Token[]) {
        yield* tokens;
      }(tokens);

      rules.forEach((rule, i) => {
        const { value } = iterable.next();
        let syllables   = 0;
        let surface     = '';

        // Beginning of the clause
        if (!value.pronunciation || rule < countSyllables(value.pronunciation)) {
          return;
        } else if (i === 0 && !isStartableWith(value)) {
          return;
        } else if (rules.length === i + 1 && !isFinishableWith(value)) {
          return;
        }

        syllables += countSyllables(value.pronunciation);
        surface   += value.surface_form;

        while (syllables < rule) {
          const { value } = iterable.next();

          if (!value.pronunciation || rule < countSyllables(value.pronunciation)) {
            return;
          }

          syllables += countSyllables(value.pronunciation);
          surface   += value.surface_form;
        }

        if (syllables !== rule) {
          return;
        }

        matches.push(surface);
      });

      if (matches.length !== rules.length) {
        return;
      }

      resolve(matches);
    });
  });
}
