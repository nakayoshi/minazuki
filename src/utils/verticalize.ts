const verticalAndHorizontalCharactorMap: { targets: string[], vertical: string }[] = [
  {
    targets: ['｜'],
    vertical: 'ー',
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
  return text.replace(/[A-Za-z0-9]/g, (text) => String.fromCharCode(text.charCodeAt(0) + 0xFEE0));
};

/**
 * Transform specific charactors to mapped vartical style charactor
 * @param text text to transfrom
 * @return transformed text
 */
export const transformHorizontalToVerticalUnicode = (text: string) => {
  verticalAndHorizontalCharactorMap.forEach(({ targets, vertical }) => {
    targets.forEach((target) => {
      text = text.replace(target, vertical);
    });
  });

  return text;
};

/**
 * Verticalize Japanese text from horizontal
 * @param text Target text to transform
 * @return Varticalized text
 */
export default function verticalize (text: string): string {
  const lines = text.trim().split('\n').map((line) => line.split('')).reverse();
  const whiteSpace = '　';
  let verticalizedText = '';
  let index = 0;

  while (true) {
    const charAtLine = lines.map((line) => line[index] ? line[index] : whiteSpace);

    if (charAtLine.join('') === whiteSpace.repeat(lines.length)) {
      break;
    }

    verticalizedText += charAtLine.join('') + '\n';
    index++;
  }

  // Avoid trimming
  verticalizedText = verticalizedText.replace(/^\s+?/, '.' + whiteSpace);

  // Transforming to appropriate unicodes
  verticalizedText = transformHorizontalToVerticalUnicode(transformLatinToFullWidth(verticalizedText));

  return verticalizedText;
}
