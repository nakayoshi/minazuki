declare namespace Kuromoji {
  interface Token {
    /** 辞書内での単語ID */
    word_id: number;
    /** 単語タイプ(辞書に登録されている単語ならKNOWN, 未知語ならUNKNOWN) */
    word_type: 'KNOWN'|'UNKNOWN';
    /** 単語の開始位置 */
    word_position: number;
    /** 表層形 */
    surface_form: string;
    /** 品詞 */
    pos: string;
    /** 品詞細分類1 */
    pos_detail_1: string;
    /** 品詞細分類2 */
    pos_detail_2: string;
    /** 品詞細分類3 */
    pos_detail_3: string;
    /** 活用型 */
    conjugated_type: string;
    /** 活用形 */
    conjugated_form: string;
    /** 基本形 */
    basic_form: string;
    /** 読み */
    reading?: string;
    /** 発音 */
    pronunciation?: string;
  }

  interface TokenizerBuilderOption {
    /** Dictionary directory path (or URL using in browser) */
    dicPath: string;
  }

  declare function builder (option: TokenizerBuilderOption): TokenizerBuilder;


  /**
   * Tokenizer
   */
  declare class Tokenizer {
    /**
     * Split into sentence by punctuation
     * @param input input Input text
     * @return Sentences end with punctuation
     */
    public splitByPunctuation (input: string): string[] {};

    /**
     * Tokenize text
     * @param text text Input text to analyze
     * @return Tokens
     */
    public tokenize (text: string): Token[] {};

    /**
     *
     * @param sentence
     * @param tokens
     */
    public tokenizeForSentence (sentence: string, tokens: Token[]): Token[] {};

    /**
     * Build word lattice
     * @param text Input text to analyze
     * @return Word lattice
     */
    public getLattice = function (text: string): any {};
  }


  /**
   * TokenizerBuilder create Tokenizer instance.
   */
  declare class TokenizerBuilder {
    /**
     * @param option JSON object which have key-value pairs settings
     */
    constructor (option: TokenizerBuilderOption);

    /**
     * Build Tokenizer instance by asynchronous manner
     * @param callback Callback function
     */
    public build (callback: (err: Error, tokenizer: Tokenizer) => void) {};
  }
}

declare module 'kuromoji' {
  export = Kuromoji;
}
