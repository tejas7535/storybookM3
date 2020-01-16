import { importer, PageNotFoundModule } from './page-not-found.module';

import * as testJson from './i18n/en.json';

describe('PageNotFoundModule', () => {
  let module: PageNotFoundModule;

  beforeEach(() => {
    module = new PageNotFoundModule();
  });

  test('should exist', () => {
    expect(module).toBeDefined();
  });

  describe('importer', () => {
    test('should import language from root path', async () => {
      const result = await importer('en', 'i18n');

      expect(result).toEqual(testJson);
    });
  });
});
