export const MatsuoBasho = jest.fn(() => ({
  __esModule: true,
  findHaiku: jest
    .fn()
    .mockResolvedValue([
      '田子の浦に',
      'うちいでてみれば',
      '白妙の',
      '富士の高嶺に',
      '雪は降りつつ',
    ]),
}));
