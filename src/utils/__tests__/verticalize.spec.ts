import verticalize from '../verticalize';

describe('verticalize', () => {
  it ('verticalizes text', () => {
    const text = 'aaa\nbbb\nccc';

    const result = verticalize(text);
    const resultJson = JSON.stringify(result);

    expect(resultJson).toMatchSnapshot();
  });
});
