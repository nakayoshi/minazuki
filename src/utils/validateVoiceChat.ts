export default function validateVoiceChat (content: string): string {
  const otakuDict = [
    {
      regexp: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
      reading: 'ユーアールエル',
    },
    {
      regexp: /^<@[0-9]+>/g,
      reading: 'メンション',
    },
    {
      regexp: /ｗ/g,
      reading: 'わら',
    },
  ];

  let validatedContent = content;

  otakuDict.forEach((item) => {
    validatedContent = validatedContent.replace(item.regexp, item.reading);
  });

  return validatedContent;
}
