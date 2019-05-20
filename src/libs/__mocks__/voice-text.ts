export const VoiceText = jest.fn(() => ({
  __esModule: true,
  speak: jest.fn().mockResolvedValue('path'),
}));
