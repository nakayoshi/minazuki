import verticalize from '../verticalize';

describe('verticalize', () => {
  it ('verticalizes text', () => {
    const text = 'aaa\nbbb\nccc';
    const result = verticalize(text);

    expect(result).toEqual('ｃｂａ\nｃｂａ\nｃｂａ\n');
  });
});
