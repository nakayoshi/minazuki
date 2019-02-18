import { delay } from '../delay';

describe('delay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('awaits while specified ms', () => {
    delay(1000);
    expect(setTimeout).toBeCalledTimes(1);
    expect(setTimeout).toBeCalledWith(expect.any(Function), 1000);
  });
});
