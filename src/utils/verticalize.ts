export const toFullWidth = (s: string) => {
  return s.replace(/[A-Za-z0-9]/g, (s) => String.fromCharCode(s.charCodeAt(0) + 0xFEE0));
};

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
  // Convert alphabet to full width
  verticalizedText = toFullWidth(verticalizedText);

  return verticalizedText;
}
