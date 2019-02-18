export const VoiceText = jest.fn(() => ({
  speak: jest.fn().mockResolvedValue('path'),
}));
