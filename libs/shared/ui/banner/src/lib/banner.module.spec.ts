import { loader } from './banner.component';
import { BannerModule } from './banner.module';
import * as testJsonDe from './i18n/de.json';
import * as testJsonEn from './i18n/en.json';

describe('BannerModule', () => {
  test('should work', () => {
    expect(new BannerModule()).toBeDefined();
  });

  describe('importer', () => {
    test('de should import language from root path', () => {
      return loader['de']().then((result: any) => {
        expect(result).toStrictEqual(testJsonDe);
      });
    });
    test('en should import language from root path', () => {
      return loader['en']().then((result: any) => {
        expect(result).toStrictEqual(testJsonEn);
      });
    });
  });
});
