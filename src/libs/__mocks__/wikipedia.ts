export const Wikipedia = jest.fn(() => ({
  search: jest.fn().mockResolvedValue({
    raw: {
      pageid: '123',
    },
    summary: jest.fn(() => 'summary'),
  }),
}));
