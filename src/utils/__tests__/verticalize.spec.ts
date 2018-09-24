import verticalize from '../verticalize';

describe('verticalize', () => {
  it ('verticalizes latin text', () => {
    const text = 'aaa\nbbb\nccc';
    const result = verticalize(text);

    expect(result).toEqual('ｃｂａ\nｃｂａ\nｃｂａ\n');
  });

  it ('verticalizes specific unicode charactors', () => {
    const text = '彼は「あーあ」と言った';
    const result = verticalize(text);

    expect(result).toEqual('彼\nは\n﹁\nあ\n｜\nあ\n﹂\nと\n言\nっ\nた\n');
  });
});
