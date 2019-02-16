const verticalAndHorizontalCharactorMap: {
  targets: string[];
  vertical: string;
}[] = [
  {
    targets: ['ー'],
    vertical: '｜',
  },
  {
    targets: ['（', '('],
    vertical: '︵',
  },
  {
    targets: [')', '）'],
    vertical: '︶',
  },
  {
    targets: ['「', '｢'],
    vertical: '﹁',
  },
  {
    targets: ['｣', '」'],
    vertical: '﹂',
  },
  {
    targets: ['『'],
    vertical: '﹃',
  },
  {
    targets: ['』'],
    vertical: '﹄',
  },
  {
    targets: ['[', '［'],
    vertical: '﹇',
  },
  {
    targets: [']', '］'],
    vertical: '﹈',
  },
  {
    targets: ['{', '｛'],
    vertical: '︷',
  },
  {
    targets: ['}', '｝'],
    vertical: '︸',
  },
  {
    targets: ['〔', '❲'],
    vertical: '︹',
  },
  {
    targets: ['〕', '❳'],
    vertical: '︺',
  },
  {
    targets: ['〈', '〈'],
    vertical: '︿',
  },
  {
    targets: ['〉', '〉'],
    vertical: '﹀',
  },
  {
    targets: ['《', '⟪'],
    vertical: '︽',
  },
  {
    targets: ['》', '⟫'],
    vertical: '︾',
  },
  {
    targets: ['【'],
    vertical: '︻',
  },
  {
    targets: ['】'],
    vertical: '︼',
  },
  {
    targets: ['〖'],
    vertical: '︗',
  },
  {
    targets: ['〗'],
    vertical: '︘',
  },
];

/**
 * Transform `a-z` to `ａ-ｚ` style
 * @param text text to transform
 * @return transformed text
 */
export const transformLatinToFullWidth = (text: string) => {
  return text.replace(/[A-Za-z0-9]/g, tmpText =>
    String.fromCharCode(tmpText.charCodeAt(0) + 0xfee0),
  );
};

/**
 * Transform specific charactors to mapped vartical style charactor
 * @param text text to transfrom
 * @return transformed text
 */
export const transformHorizontalToVerticalUnicode = (text: string) => {
  let newText = text;

  verticalAndHorizontalCharactorMap.forEach(({ targets, vertical }) => {
    targets.forEach(target => {
      newText = newText.replace(target, vertical);
    });
  });

  return newText;
};

/**
 * Verticalize Japanese text from horizontal
 * @param text Target text to transform
 * @return Varticalized text
 */
export function verticalize(text: string): string {
  const lines = text
    .trim()
    .split('\n')
    .map(line => line.split(''))
    .reverse();
  const whiteSpace = '　';
  let verticalizedText = '';
  let index = 0;

  while (true) {
    const charAtLine = lines.map(line =>
      line[index] ? line[index] : whiteSpace,
    );

    if (charAtLine.join('') === whiteSpace.repeat(lines.length)) {
      break;
    }

    verticalizedText += `${charAtLine.join('')}\n`;
    index += 1;
  }

  // Avoid trimming
  verticalizedText = verticalizedText.replace(/^\s+?/, `.${whiteSpace}`);

  // Transforming to appropriate unicodes
  verticalizedText = transformHorizontalToVerticalUnicode(
    transformLatinToFullWidth(verticalizedText),
  );

  return verticalizedText;
}
