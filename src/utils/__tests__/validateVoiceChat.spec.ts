import { validateVoiceChat } from 'src/utils/validateVoiceChat';

describe('validateVoiceChat', () => {
  it('validates mention to suitable form for voice chat', () => {
    const text = '<@123456789>';
    const result = validateVoiceChat(text);

    expect(result).toBe('メンション');
  });

  it('validates URL to suitable form for voice chat', () => {
    const text = 'https://www.google.com/';
    const result = validateVoiceChat(text);

    expect(result).toBe('ユーアールエル');
  });
});
