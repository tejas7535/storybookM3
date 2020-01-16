import { BannerModule } from './banner.module';

import { importer } from './banner.component';

import * as testJson from './i18n/en.json';

describe('BannerModule', () => {
  test('should work', () => {
    expect(new BannerModule()).toBeDefined();
  });

  describe('importer', () => {
    test('should import language from root path', async () => {
      const result = await importer('en', 'i18n');

      expect(result).toEqual(testJson);
    });
  });
});
