import Kuromoji from 'kuromoji';

interface AnalyzedToken {
  /** Surface form of the token */
  surface: string;
  /** Number of syllables */
  syllables: number;
  /** Whether the token is haiku */
  continue: boolean;
}

/**
 * MatsuoBasho provides utilities for haiku
 * Original algorithm was desined by github.com/mattn 🙏
 * https://github.com/mattn/go-haiku/blob/master/haiku.go
 */
export class MatsuoBasho {
  protected ignoreSymbols = /[\[\]「」『』]/g;
  protected voicelessChars = /[ァィゥェォャュョ]/g;
  protected kana = /[ァ-ヴー]/g;
  protected notKana = /[^ァ-ヴー]/g;

  /**
   * @param rules Array of number which represents rule for the haiku, like [5, 7, 5]
   * @param dictionaryPath Path to dictionary for Kuromoji
   */
  constructor(public rules: number[], public dictionaryPath: string) {}

  /**
   * countChars return count of characters with ignoring japanese small letters.
   * @param string String to count
   * @return The result
   */
  protected countSyllables(string: string): number {
    const formattedString = string
      .replace(this.voicelessChars, '')
      .replace(this.notKana, '');

    return formattedString.length;
  }

  /**
   * canBeHeader returns true when the kind of the word
   * is possible to be leading of sentence.
   * @param token Token to check
   * @return The result
   */
  protected canBeHeader(token: Kuromoji.Token): boolean {
    const posForHeader = [
      '名詞',
      '形容詞',
      '形容動詞',
      '副詞',
      '連体詞',
      '接続詞',
      '感動詞',
      '接頭詞',
      'フィラー',
    ];

    if (
      posForHeader.includes(token.pos) &&
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

  /**
   * canBeFooter returns true when the kind of the word
   * is possible to be ending of mora
   * @param token Token to check
   * @return The result
   */
  protected canBeFooter(token: Kuromoji.Token): boolean {
    return (
      token.pos_detail_1 !== '非自立' &&
      !/^連用/.test(token.conjugated_form) &&
      token.conjugated_form !== '未然形'
    );
  }

  /**
   * isSpace returns true when the specified token was a space
   * @param token Token to check
   * @return The result
   */
  protected isSpace(token: Kuromoji.Token): boolean {
    return token.pos_detail_1 === '空白';
  }

  /**
   * Provides the next token when next() called,
   * Sequence will be reset if `true` specified in the argument
   * @param tokens Tokens to generate
   * @return Iterable of tokens
   */
  protected *tokensIterableGenerator(
    tokens: Kuromoji.Token[],
  ): Iterator<Kuromoji.Token, void, true | undefined> {
    let index = 0;
    let lastIndex = 0;

    while (tokens[index]) {
      const reset = yield tokens[index];

      if (reset) {
        lastIndex += 1;
        index = lastIndex;
      } else {
        index += 1;
      }
    }
  }

  /**
   * Analyze a token with Kuromoji
   * @param token Token to analyze
   * @param rule Rule for the mora
   * @param positionInMora Position of mora in the rule
   * @param positionInHaiku Position of rule in the haiku
   * @param syllables Sum of syllables of mora
   */
  protected analyzeToken(
    token: Kuromoji.Token,
    rule: number,
    positionInMora: number,
    positionInHaiku: number,
    syllables: number,
  ): AnalyzedToken {
    const reading = this.kana.test(token.surface_form)
      ? token.surface_form
      : token.pronunciation;

    if (this.isSpace(token) || token.surface_form === '、') {
      return { continue: true, syllables: 0, surface: '' };
    }

    if (
      // Readingless word
      !reading ||
      // Check if excess
      rule < syllables + this.countSyllables(reading) ||
      // Check is the word beginning of mora and is it suitable
      (positionInMora === 0 && !this.canBeHeader(token)) ||
      // Check is the word ending of haiku and is it suitable
      (positionInHaiku + 1 === this.rules.length &&
        syllables + this.countSyllables(reading) === rule &&
        !this.canBeFooter(token))
    ) {
      return { continue: false, syllables: 0, surface: '' };
    }

    return {
      syllables: this.countSyllables(reading),
      surface: token.surface_form,
      continue: true,
    };
  }

  /**
   * Find a mora from tokens
   * @param tokens Iterable of tokens to find
   * @param rule Rule for the mora
   * @param positionInHaiku position of mora in the rule of haiku
   */
  protected findMora(
    tokens: Iterator<Kuromoji.Token, void, boolean | undefined>,
    rule: number,
    positionInHaiku: number,
  ): string | null {
    let syllables = 0;
    let surfaces = '';
    let position = 0;

    while (syllables < rule) {
      const { value: token, done } = tokens.next();

      if (done) {
        return null;
      }

      if (typeof token === 'object') {
        const analyzedToken = this.analyzeToken(
          token,
          rule,
          position,
          positionInHaiku,
          syllables,
        );

        if (!analyzedToken.continue) {
          return null;
        }

        syllables += analyzedToken.syllables;
        surfaces += analyzedToken.surface;
        position += 1;
      }
    }

    if (syllables === rule) {
      return surfaces;
    }

    return null;
  }

  /**
   * Find a haiku on specified sentence
   * @param text Sentence to find
   * @return Haiku splited by rules
   */
  public async findHaiku(text: string): Promise<string[] | undefined> {
    let matches: string[] = [];
    const validatedText = text.replace(this.ignoreSymbols, '');

    return new Promise((resolve, reject) => {
      Kuromoji.builder({ dicPath: this.dictionaryPath }).build(
        (error, tokenizer) => {
          if (error) {
            reject('findHaiku: Error occured while loading dictionaly');
          }

          const tokens = this.tokensIterableGenerator(
            tokenizer.tokenize(validatedText),
          );
          let position = 0;

          while (matches.length < this.rules.length) {
            const rule = this.rules[position];
            const mora = this.findMora(tokens, rule, position);

            if (!mora) {
              matches = [];
              position = 0;
              const { done } = tokens.next(true);
              if (done) break;
              continue;
            }

            matches.push(mora);
            position += 1;
          }

          resolve(matches.length === this.rules.length ? matches : undefined);
        },
      );
    });
  }
}
