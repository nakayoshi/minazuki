export const Wikipedia = jest.fn(() => ({
  __esModule: true,
  search: jest.fn().mockResolvedValue({
    raw: {
      pageid: '123',
    },
    summary: jest.fn(() => 'summary'),
  }),
}));
