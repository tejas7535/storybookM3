import { BannerModule } from './banner.module';

import { de, en } from './banner.component';

import * as testJsonDe from './i18n/de.json';
import * as testJsonEn from './i18n/en.json';

describe('BannerModule', () => {
  test('should work', () => {
    expect(new BannerModule()).toBeDefined();
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
