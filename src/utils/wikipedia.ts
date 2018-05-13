import wikijs from 'wikijs';
const cleint = wikijs({apiUrl: 'https://ja.wikipedia.org/w/api.php'});

export async function searchWikipedia (keyword: string) {
  try {
    const page    = await cleint.page(keyword);
    const summary = await page.summary();
    return summary;
  } catch (e) {
    return '記事が見つからなかったです。';
  }
}
