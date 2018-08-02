import WikiJS from 'wikijs';

export default class Wikipedia  {

  protected client = WikiJS({
    apiUrl: 'https://ja.wikipedia.org/w/api.php',
  });

  /**
   * Fuzzy search an Wikipedia article
   * @param keyword Query string
   * @return Result Page object, I wonder why WikiJS didn't export it
   */
  public async search (keyword: string): Promise<any> {
    try {
      const { results } = await this.client.search(keyword);

      if (!results.length) {
        return null;
      }

      const page = await this.client.page(results[0]);

      return page;

    } catch (e) {
      return null;
    }
  }
}
