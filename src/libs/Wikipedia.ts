import WikiJS, { Page } from 'wikijs';

export class Wikipedia {
  protected client = WikiJS({
    apiUrl: 'https://ja.wikipedia.org/w/api.php',
  });

  /**
   * Fuzzy search an Wikipedia article
   * @param keyword Query string
   * @return Result Page object, I wonder why WikiJS didn't export it
   */
  public async search(keyword: string) {
    try {
      const { results } = await this.client.search(keyword);

      if (!results.length) {
        return null;
      }

      return (await this.client.page(results[0])) as Page & { pageid: string };
    } catch (e) {
      return null;
    }
  }
}
