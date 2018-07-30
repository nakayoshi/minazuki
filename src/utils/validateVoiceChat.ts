export default function validateVoiceChat (content: string): string {
  const urlRegex     = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  const mentionRegex = /^<@[0-9]+>$/;

  return content
    .replace(urlRegex, 'ゆーあーるえる。')
    .replace(mentionRegex, 'めんしょん。');
}
