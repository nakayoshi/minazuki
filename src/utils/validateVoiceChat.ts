/**
 * Common validation and transformation for voice chat script
 * @param content content to validate
 * @return validated content
 */
export default function validateVoiceChat (content: string): string {
  const dict = [
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

  dict.forEach((item) => {
    validatedContent = validatedContent.replace(item.regexp, item.reading);
  });

  return validatedContent;
}
