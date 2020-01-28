import { de, en, PageNotFoundModule } from './page-not-found.module';

import * as testJsonDe from './i18n/de.json';
import * as testJsonEn from './i18n/en.json';

describe('PageNotFoundModule', () => {
  let module: PageNotFoundModule;

  beforeEach(() => {
    module = new PageNotFoundModule();
  });

  test('should exist', () => {
    expect(module).toBeDefined();
  });

  describe('importer', () => {
    test('de should import language from root path', async () => {
      const result = await de();

      expect(result).toEqual(testJsonDe);
    });
    test('en should import language from root path', async () => {
      const result = await en();

      expect(result).toEqual(testJsonEn);
    });
  });
});
